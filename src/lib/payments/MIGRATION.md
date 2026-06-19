# Guía de migración: cambiar de proveedor de pago

## Arquitectura actual

```
src/lib/payments/
├── interface.js        # Tipos JSDoc — define el contrato, sin lógica
├── index.js            # Exporta el proveedor activo (stripeProvider)
├── stripeProvider.js   # Implementación Stripe
└── MIGRATION.md        # Este archivo

supabase/functions/
├── create-payment-session/   # Crea la sesión de pago (Stripe)
├── stripe-webhook/           # Procesa confirmaciones de pago de Stripe
└── get-order-status/         # Retorna orders.status — AGNÓSTICO al proveedor
```

`CheckoutPage` y `OrderSuccessPage` importan **únicamente** desde `src/lib/payments/index.js`.
Ninguna página toca Stripe directamente.

---

## Flujo actual (Stripe Hosted Checkout)

```
Cliente → CheckoutPage
  → supabase INSERT orders (status: pending)
  → paymentProvider.createPaymentSession(order)
      → Edge Function create-payment-session
          → stripe.checkout.sessions.create(...)
          → retorna { url }
  → window.location.href = url   ← redirige a stripe.com

Stripe → stripe-webhook Edge Function
  evento: checkout.session.completed
    → UPDATE orders SET status = 'paid' WHERE id = order_id
  evento: checkout.session.expired
    → UPDATE orders SET status = 'cancelled' WHERE id = order_id

Stripe → /order-success?id={order_id}
  → paymentProvider.verifyPayment(orderId)
      → Edge Function get-order-status
          → SELECT status FROM orders WHERE id = order_id
          → retorna { status }
  → polling cada 2 seg hasta status != 'pending'
```

---

## Checklist para migrar a Wompi o Bold

### 1. Crear el nuevo proveedor

Crear `src/lib/payments/wompiProvider.js`:

```js
import { supabase } from '../supabase'

export const wompiProvider = {
  async createPaymentSession(order) {
    const { data, error } = await supabase.functions.invoke('create-wompi-session', {
      body: { order_id: order.id },
    })
    if (error) throw new Error(error.message)
    return { redirectUrl: data.redirect_url, sessionId: data.payment_id }
  },

  async verifyPayment(orderId) {
    // get-order-status es agnóstico — no necesita cambios
    const { data, error } = await supabase.functions.invoke('get-order-status', {
      body: { order_id: orderId },
    })
    if (error) throw new Error(error.message)
    return { status: data.status }
  },
}
```

### 2. Activar el nuevo proveedor (1 línea en index.js)

```js
// src/lib/payments/index.js

// Antes:
import { stripeProvider } from './stripeProvider'
export const paymentProvider = stripeProvider

// Después:
import { wompiProvider } from './wompiProvider'
export const paymentProvider = wompiProvider
```

### 3. Crear las Edge Functions necesarias

**`supabase/functions/create-wompi-session/index.ts`**
- Recibe `{ order_id }`
- Lee la orden de Supabase (service role)
- Llama a la API de Wompi/Bold para crear la transacción
- Retorna `{ redirect_url, payment_id }`
- Configura `redirect_url` con `origin + /order-success?id={order_id}`

**`supabase/functions/wompi-webhook/index.ts`**
- Recibe el webhook de confirmación de Wompi/Bold
- Verifica la firma (Wompi usa HMAC-SHA256 con `integrity_key`)
- En evento de pago aprobado: `UPDATE orders SET status = 'paid'`
- En evento de pago rechazado/expirado: `UPDATE orders SET status = 'cancelled'`

> `get-order-status` **no necesita modificarse** — ya es agnóstico al proveedor.

### 4. Registrar el webhook

En el dashboard de Wompi/Bold, configurar:
```
https://<tu-project-ref>.supabase.co/functions/v1/wompi-webhook
```

### 5. Variables de entorno

**Supabase secrets (agregar):**
```bash
supabase secrets set WOMPI_PRIVATE_KEY=prv_prod_...
supabase secrets set WOMPI_EVENTS_KEY=prv_prod_...  # para verificar firma de webhooks
```

**Supabase secrets (eliminar cuando Stripe ya no se use):**
- Borrar desde el dashboard: Settings → Edge Functions → Secrets
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

**Frontend `.env` (si el widget de Wompi/Bold requiere clave pública):**
```
VITE_WOMPI_PUBLIC_KEY=pub_prod_...
```

### 6. Notas sobre currency

En `create-payment-session/index.ts` (Stripe actual):
```typescript
currency: 'usd',                          // ← cambiar
unit_amount: Math.round(item.price * 100) // USD en centavos
```

Para COP con Wompi/Bold:
```typescript
// COP no tiene centavos → pasar el valor entero
amount_in_cents: Math.round(item.price) * 100  // Wompi sí usa centavos
// O según la API de Bold:
amount: Math.round(item.price)
currency: 'COP'
```

Verificar la documentación de cada proveedor para el formato exacto.

---

## Tabla comparativa

| Aspecto               | Stripe (actual)                          | Wompi                          | Bold                          |
|-----------------------|------------------------------------------|--------------------------------|-------------------------------|
| Tipo de checkout      | Hosted (redirige a stripe.com)           | Widget embed o redirect        | Widget embed o redirect       |
| Evento webhook pago ✓ | `checkout.session.completed`             | `transaction.updated` (APPROVED)| `payment.completed`           |
| Verificación de firma | `stripe.webhooks.constructEventAsync`    | HMAC-SHA256 con `events_key`   | HMAC-SHA256                   |
| PSE                   | No soportado                             | Soportado nativo               | Soportado nativo              |
| Moneda                | USD (test) / COP posible                 | COP                            | COP                           |
| SDK oficial           | `npm:stripe`                             | Sin SDK oficial (REST)         | Sin SDK oficial (REST)        |
| Archivos a tocar      | ninguno                                  | wompiProvider.js + 2 Edge Fn   | boldProvider.js + 2 Edge Fn   |
