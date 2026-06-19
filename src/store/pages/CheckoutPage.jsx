import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../context/CartContext'
import { paymentProvider } from '../../lib/payments'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [searchParams] = useSearchParams()
  const cancelled = searchParams.get('cancelled') === 'true'

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Carrito vacío y no venimos de un pago cancelado → no hay nada que pagar
  if (items.length === 0 && !cancelled) {
    return <Navigate to="/petshop" replace />
  }

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('El nombre, el teléfono y la dirección son obligatorios.')
      return
    }
    setSubmitting(true)
    setError('')

    // 1. Guardar la orden en Supabase
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: form.name.trim(),
        customer_email: form.email.trim() || null,
        customer_phone: form.phone.trim() || null,
        shipping_address: form.address.trim(),
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image_url: i.image_url,
        })),
        total,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError || !order) {
      setError('Error al guardar el pedido. Intentá de nuevo.')
      setSubmitting(false)
      return
    }

    // 2. Crear sesión de pago a través de la capa de abstracción
    //    El carrito se limpia en /order-success SOLO si el pago es exitoso.
    //    Así, si el usuario cancela en Stripe, puede reintentar con su carrito intacto.
    try {
      const { redirectUrl } = await paymentProvider.createPaymentSession(order)
      window.location.href = redirectUrl
    } catch (err) {
      setError(err.message ?? 'No se pudo iniciar el pago. Intentá de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Aviso de pago cancelado */}
      {cancelled && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <svg className="w-5 h-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          El pago fue cancelado. Tu carrito sigue intacto — podés intentarlo de nuevo.
        </div>
      )}

      {/* Back link + title */}
      <div className="mb-8">
        <Link
          to="/petshop"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Volver a la tienda
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Finalizar compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Form — 3 cols */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
          >
            <h2 className="font-semibold text-gray-900">Tus datos de contacto</h2>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                required
                autoComplete="name"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition"
                placeholder="Juan García"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Email{' '}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Teléfono <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setField('phone', e.target.value)}
                required
                autoComplete="tel"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition"
                placeholder="300 123 4567"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Dirección de envío <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.address}
                onChange={e => setField('address', e.target.value)}
                required
                rows={3}
                autoComplete="street-address"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition resize-none"
                placeholder={"Calle 30 #45-67, El Cabrero\nCartagena, Bolívar"}
              />
              <p className="text-xs text-gray-400">Barrio y ciudad para coordinar el envío en Cartagena.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando…
                </>
              ) : (
                <>
                  Ir a pagar
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              Serás redirigido a la página de pago segura de Stripe.
            </p>
          </form>
        </div>

        {/* Order summary — 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">
              Resumen ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>

            <ul className="space-y-3 mb-4">
              {items.map(item => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M96 144c0 35.3 21.5 64 48 64s48-28.7 48-64-21.5-64-48-64-48 28.7-48 64zm224 0c0 35.3 21.5 64 48 64s48-28.7 48-64-21.5-64-48-64-48 28.7-48 64zM48 240c0 26.5 14.3 48 32 48s32-21.5 32-48-14.3-48-32-48-32 21.5-32 48zm352 0c0 26.5 14.3 48 32 48s32-21.5 32-48-14.3-48-32-48-32 21.5-32 48zM256 304c-70.7 0-128 42.9-128 96 0 35.3 28.7 64 64 64h128c35.3 0 64-28.7 64-64 0-53.1-57.3-96-128-96z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="flex-1 text-sm text-gray-700 truncate">{item.name}</p>
                  <p className="text-sm font-medium text-gray-900 shrink-0">
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span className="text-gray-400">A coordinar</span>
              </div>
              <div className="flex items-center justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
