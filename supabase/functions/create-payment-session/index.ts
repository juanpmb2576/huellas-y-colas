import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { order_id } = await req.json()

    if (!order_id) {
      return new Response(JSON.stringify({ error: 'order_id requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Leer la orden completa con service role (bypasea RLS)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_email, items, total')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Orden no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Verificar stock real antes de crear la sesión — el carrito pudo quedar
    // desactualizado si alguien más compró el mismo producto mientras tanto.
    type OrderItem = { id: string; name: string; price: number; quantity: number; image_url?: string }
    const orderItems = order.items as OrderItem[]

    const { data: products } = await supabase
      .from('products')
      .select('id, stock')
      .in('id', orderItems.map(i => i.id))

    if (products) {
      const stockMap = new Map(products.map(p => [p.id, p.stock as number]))
      for (const item of orderItems) {
        const available = stockMap.get(item.id) ?? 0
        if (available < item.quantity) {
          return new Response(JSON.stringify({
            error: `"${item.name}" ya no tiene stock suficiente. Disponible: ${available}, en tu carrito: ${item.quantity}. Por favor actualizá tu carrito.`,
          }), {
            status: 409,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }
      }
    }

    // Construir line_items desde el snapshot JSONB de la orden
    const lineItems = (order.items as Array<{
      name: string
      price: number
      quantity: number
      image_url?: string
    }>).map((item) => ({
      price_data: {
        // Stripe trata COP igual que USD: el amount va en centavos (×100).
        // 50.000 COP → 5.000.000 centavos. Mínimo Stripe: ~1.000 COP (100.000 centavos).
        currency: 'cop',
        product_data: {
          name: item.name,
          ...(item.image_url ? { images: [item.image_url] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // COP en centavos, igual que USD
      },
      quantity: item.quantity,
    }))

    const origin = req.headers.get('origin') ?? 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Pre-rellena el email en el checkout de Stripe
      ...(order.customer_email ? { customer_email: order.customer_email } : {}),
      success_url: `${origin}/petshop/order-success?id=${order_id}`,
      cancel_url: `${origin}/petshop/checkout?cancelled=true`,
      // Guardamos order_id en metadata para identificar la orden en el webhook
      metadata: { order_id },
    })

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[create-payment-session]', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
