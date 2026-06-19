import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

type OrderItem = { id: string; name: string; quantity: number; price: number }

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  if (!signature) {
    return new Response('Falta firma stripe-signature', { status: 400 })
  }

  // Leer body crudo ANTES de parsearlo — necesario para verificar la firma
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de firma'
    console.error('[stripe-webhook] Firma inválida:', message)
    return new Response(`Firma inválida: ${message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const order_id = session.metadata?.order_id

        if (!order_id) break

        // Leer la orden antes de modificarla
        const { data: order, error: fetchError } = await supabase
          .from('orders')
          .select('status, items')
          .eq('id', order_id)
          .single()

        if (fetchError || !order) {
          console.error('[stripe-webhook] Orden no encontrada:', order_id)
          return new Response('Orden no encontrada', { status: 404 })
        }

        // Guard de idempotencia: si ya fue procesada (paid/cancelled), no hacer nada.
        // Stripe puede reintentar el mismo webhook — esta verificación evita que el
        // stock se descuente dos veces por el mismo pedido.
        if (order.status !== 'pending') {
          console.log(`[stripe-webhook] Orden ${order_id} ya estaba en '${order.status}' — ignorando reintento`)
          break
        }

        // Marcar como pagada
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', order_id)

        if (updateError) {
          console.error('[stripe-webhook] Error actualizando a paid:', updateError.message)
          return new Response('Error al actualizar la orden', { status: 500 })
        }

        console.log(`[stripe-webhook] Orden ${order_id} marcada como paid`)

        // Descontar stock de cada producto
        const items = order.items as OrderItem[]

        for (const item of items) {
          try {
            const { data: product, error: fetchStockError } = await supabase
              .from('products')
              .select('stock')
              .eq('id', item.id)
              .single()

            if (fetchStockError || !product) {
              console.error(`[stripe-webhook] Producto ${item.id} (${item.name}) no encontrado — stock no descontado`)
              continue
            }

            const newStock = product.stock - item.quantity

            const { error: stockError } = await supabase
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.id)

            if (stockError) {
              console.error(`[stripe-webhook] Error descontando stock de "${item.name}" (${item.id}):`, stockError.message)
            } else if (newStock < 0) {
              console.warn(`[stripe-webhook] STOCK NEGATIVO — "${item.name}" (${item.id}): ${newStock}. Revisar manualmente.`)
            } else {
              console.log(`[stripe-webhook] Stock de "${item.name}": ${product.stock} → ${newStock}`)
            }
          } catch (err) {
            // Error inesperado en un item: loguearlo y continuar con el siguiente.
            // No se revierte el pago — el stock negativo queda para revisión manual.
            console.error(`[stripe-webhook] Error inesperado en producto ${item.id}:`, err)
          }
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const order_id = session.metadata?.order_id

        if (order_id) {
          await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', order_id)
            .eq('status', 'pending') // No sobreescribir un 'paid'

          console.log(`[stripe-webhook] Orden ${order_id} marcada como cancelled (sesión expirada)`)
        }
        break
      }

      default:
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    console.error('[stripe-webhook] Error procesando evento:', message)
    return new Response(`Error: ${message}`, { status: 500 })
  }
})
