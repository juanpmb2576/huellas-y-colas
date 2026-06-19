/**
 * Capa de abstracción de pagos — definición de la interfaz genérica.
 *
 * Todo proveedor de pago (Stripe, Wompi, Bold, etc.) debe implementar
 * los dos métodos definidos aquí. El resto de la app importa ÚNICAMENTE
 * desde index.js y nunca depende de un proveedor específico.
 *
 * Ver MIGRATION.md para instrucciones de cambio de proveedor.
 */

/**
 * Resultado de crear una sesión de pago.
 * @typedef {Object} PaymentSession
 * @property {string}  redirectUrl - URL a la que redirigir al usuario para pagar
 * @property {string}  [sessionId] - ID de sesión del proveedor (opcional, para debug)
 */

/**
 * Posibles estados de una orden desde el punto de vista del pago.
 * Estos valores coinciden con la columna `status` de la tabla `orders`.
 * @typedef {'paid' | 'pending' | 'cancelled'} OrderStatus
 */

/**
 * Resultado de verificar el estado de un pago.
 * @typedef {Object} PaymentVerification
 * @property {OrderStatus} status - Estado actual del pago
 */

/**
 * Interfaz que todo proveedor de pago debe implementar.
 *
 * @typedef {Object} PaymentProvider
 *
 * @property {function(order: Object): Promise<PaymentSession>} createPaymentSession
 *   Crea una sesión de pago para la orden indicada y retorna la URL de redirección.
 *   @param {Object} order - Orden de Supabase con al menos: id, items, total
 *
 * @property {function(orderId: string): Promise<PaymentVerification>} verifyPayment
 *   Consulta el estado actual del pago para la orden indicada.
 *   Llamado de forma repetida (polling) por la página de resultado.
 *   @param {string} orderId - UUID de la orden en Supabase
 */
