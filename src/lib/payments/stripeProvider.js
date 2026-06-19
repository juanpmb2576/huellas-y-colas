import { supabase } from '../supabase'

/**
 * Implementación Stripe de PaymentProvider.
 *
 * createPaymentSession → invoca la Edge Function `create-payment-session`,
 *   que crea una Stripe Checkout Session y devuelve la URL de pago hospedada.
 *
 * verifyPayment → invoca la Edge Function `get-order-status`,
 *   que lee el campo `status` de la orden con service role key
 *   (la columna es actualizada a 'paid' por la Edge Function stripe-webhook
 *   al recibir el evento checkout.session.completed de Stripe).
 *
 * @type {import('./interface').PaymentProvider}
 */
export const stripeProvider = {
  async createPaymentSession(order) {
    const { data, error } = await supabase.functions.invoke('create-payment-session', {
      body: { order_id: order.id },
    })
    if (error) {
      // Intentar extraer el mensaje real del cuerpo de la respuesta de la Edge Function
      let message = 'No se pudo crear la sesión de pago.'
      try {
        const body = await error.context?.json()
        if (body?.error) message = body.error
      } catch {}
      throw new Error(message)
    }
    if (!data?.url) throw new Error('El servidor de pagos no devolvió una URL válida.')
    return { redirectUrl: data.url, sessionId: data.session_id }
  },

  async verifyPayment(orderId) {
    const { data, error } = await supabase.functions.invoke('get-order-status', {
      body: { order_id: orderId },
    })
    if (error) throw new Error(`No se pudo verificar el pago: ${error.message}`)
    if (!data?.status) throw new Error('Respuesta inválida del servidor.')
    return { status: data.status }
  },
}
