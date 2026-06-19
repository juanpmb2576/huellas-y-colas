import { stripeProvider } from './stripeProvider'

/**
 * Proveedor de pago activo.
 *
 * Para cambiar de proveedor, reemplazá ÚNICAMENTE estas dos líneas:
 *   import { wompiProvider } from './wompiProvider'
 *   export const paymentProvider = wompiProvider
 *
 * Ver MIGRATION.md para la checklist completa.
 *
 * @type {import('./interface').PaymentProvider}
 */
export const paymentProvider = stripeProvider
