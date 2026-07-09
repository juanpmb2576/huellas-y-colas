import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// ─── Helpers de estado ────────────────────────────────────────

const PAYMENT_LABEL = { pending: 'Pendiente', paid: 'Pagado', cancelled: 'Cancelado' }
const PAYMENT_STYLE = {
  pending:   'bg-amber-50  text-amber-700  border border-amber-200',
  paid:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-50    text-red-700    border border-red-200',
}

const SHIP_LABEL = { pending: 'Sin enviar', shipped: 'En camino', delivered: 'Entregado' }
const SHIP_STYLE = {
  pending:   'bg-gray-100   text-gray-500   border border-gray-200',
  shipped:   'bg-blue-50    text-blue-700   border border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

function StatusBadge({ label, style }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  )
}

function PawIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <ellipse cx="9"    cy="7"    rx="3"   ry="3.8"/>
      <ellipse cx="16"   cy="6"    rx="2.8" ry="3.4"/>
      <ellipse cx="5"    cy="13"   rx="2.6" ry="3.2"/>
      <ellipse cx="20.5" cy="12.5" rx="2.6" ry="3.2"/>
      <path d="M12.5 12.5c-4.8 0-7.5 3-7.5 6.5 0 2.2 1.8 3.8 7.5 3.8s7.5-1.6 7.5-3.8c0-3.5-2.7-6.5-7.5-6.5z"/>
    </svg>
  )
}

// ─── Página principal ─────────────────────────────────────────

const POLL_INTERVAL = 30_000 // 30 segundos

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null) // timestamp del último fetch exitoso
  const [secondsAgo, setSecondsAgo] = useState(0)
  const intervalRef = useRef(null)

  async function fetchOrder(isInitial = false) {
    if (isInitial) setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    setOrder(data)
    setLastUpdated(Date.now())
    setSecondsAgo(0)
    if (isInitial) setLoading(false)
  }

  // Fetch inicial + polling cada 30s
  useEffect(() => {
    fetchOrder(true)
    intervalRef.current = setInterval(() => fetchOrder(false), POLL_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Contador de "hace X segundos"
  useEffect(() => {
    if (!lastUpdated) return
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated) / 1000))
    }, 5000)
    return () => clearInterval(tick)
  }, [lastUpdated])

  if (loading) return <LoadingState />
  if (!order)  return <NotFoundState />

  const paymentStatus  = order.status ?? 'pending'
  const shipStatus     = order.fulfillment_status ?? 'pending'
  const items          = Array.isArray(order.items) ? order.items : []
  const orderDate      = new Date(order.created_at).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Encabezado con brand */}
      <div className="relative bg-manglar rounded-2xl overflow-hidden mb-8 px-6 py-8 text-center">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <PawIcon className="absolute right-4 bottom-4 w-20 h-20 text-white/[0.06] rotate-12"/>
          <PawIcon className="absolute left-3  top-3  w-12 h-12 text-hc-accent/20 -rotate-12"/>
        </div>
        <p className="relative text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
          Seguimiento de pedido
        </p>
        <h1 className="relative font-fraunces text-xl text-white font-semibold break-all">
          #{id}
        </h1>
        <p className="relative text-white/60 text-sm mt-2 font-body">{orderDate}</p>
        <p className="relative text-white/40 text-[11px] mt-3 font-body">
          {secondsAgo < 10
            ? 'Actualizado ahora mismo'
            : `Actualizado hace ${secondsAgo}s · se actualiza solo cada 30s`}
        </p>
      </div>

      {/* Estado del pedido */}
      <div className="bg-white border border-arena rounded-2xl p-5 mb-4">
        <h2 className="font-fraunces text-base font-semibold text-tierra mb-4">
          Estado del pedido
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-tierra/50 font-body mb-1.5">Pago</p>
            <StatusBadge
              label={PAYMENT_LABEL[paymentStatus] ?? paymentStatus}
              style={PAYMENT_STYLE[paymentStatus] ?? PAYMENT_STYLE.pending}
            />
          </div>
          <div>
            <p className="text-xs text-tierra/50 font-body mb-1.5">Envío</p>
            <StatusBadge
              label={SHIP_LABEL[shipStatus] ?? shipStatus}
              style={SHIP_STYLE[shipStatus] ?? SHIP_STYLE.pending}
            />
          </div>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="bg-white border border-arena rounded-2xl p-5 mb-4">
        <h2 className="font-fraunces text-base font-semibold text-tierra mb-3">
          Datos de entrega
        </h2>
        <div className="space-y-1.5 font-body text-sm text-tierra/70">
          <p><span className="font-medium text-tierra">Cliente:</span> {order.customer_name}</p>
          {order.customer_email && (
            <p><span className="font-medium text-tierra">Email:</span> {order.customer_email}</p>
          )}
          {order.shipping_address && (
            <p><span className="font-medium text-tierra">Dirección:</span> {order.shipping_address}</p>
          )}
        </div>
      </div>

      {/* Productos */}
      <div className="bg-white border border-arena rounded-2xl p-5 mb-4">
        <h2 className="font-fraunces text-base font-semibold text-tierra mb-4">
          Productos ({items.reduce((s, i) => s + (i.quantity ?? 1), 0)})
        </h2>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={item.id ?? idx} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-arena/50 shrink-0 flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover"/>
                ) : (
                  <PawIcon className="w-6 h-6 text-jade/30"/>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-tierra truncate font-body">{item.name}</p>
                <p className="text-xs text-tierra/50 font-body">
                  {item.quantity} × ${Number(item.price).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <p className="text-sm font-bold text-tierra shrink-0 font-body">
                ${(item.price * item.quantity).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-arena flex items-center justify-between">
          <p className="text-sm font-semibold text-tierra font-body">Total</p>
          <p className="font-bold text-xl text-tierra">
            ${Number(order.total).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/petshop"
          className="text-sm text-jade hover:text-jade/70 font-medium font-body transition-colors"
        >
          ← Volver a la tienda
        </Link>
      </div>

    </div>
  )
}

// ─── Estados auxiliares ───────────────────────────────────────

function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
      <div className="h-36 bg-arena rounded-2xl animate-pulse"/>
      <div className="h-28 bg-arena/70 rounded-2xl animate-pulse"/>
      <div className="h-20 bg-arena/50 rounded-2xl animate-pulse"/>
      <div className="h-48 bg-arena/50 rounded-2xl animate-pulse"/>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <PawIcon className="w-16 h-16 text-manglar/20 mx-auto mb-4"/>
      <h1 className="font-fraunces text-xl font-semibold text-tierra mb-2">
        Pedido no encontrado
      </h1>
      <p className="text-sm text-tierra/55 font-body mb-6 leading-relaxed">
        El link puede ser incorrecto o el pedido no existe.<br/>
        Revisá el link que recibiste o contactanos.
      </p>
      <Link
        to="/petshop"
        className="text-sm text-jade hover:text-jade/70 font-medium font-body transition-colors"
      >
        ← Volver a la tienda
      </Link>
    </div>
  )
}
