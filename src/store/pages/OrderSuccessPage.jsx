import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const TRACKING_BASE = 'https://huellas-y-colas-cartagena.netlify.app/petshop/order'
import { paymentProvider } from '../../lib/payments'
import { useCart } from '../context/CartContext'

const MAX_POLLS = 6
const POLL_INTERVAL_MS = 2000

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('id')
  const { clearCart } = useCart()

  // 'verifying' | 'paid' | 'cancelled' | 'timeout' | 'error'
  const [status, setStatus] = useState('verifying')
  const pollCountRef = useRef(0)
  const timerRef = useRef(null)

  const poll = useCallback(async () => {
    if (!orderId) {
      setStatus('error')
      return
    }
    try {
      const { status: orderStatus } = await paymentProvider.verifyPayment(orderId)

      if (orderStatus === 'paid') {
        clearCart()
        setStatus('paid')
      } else if (orderStatus === 'cancelled') {
        setStatus('cancelled')
      } else {
        // 'pending' — webhook aún no llegó, reintentar
        pollCountRef.current += 1
        if (pollCountRef.current < MAX_POLLS) {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        } else {
          setStatus('timeout')
        }
      }
    } catch {
      setStatus('error')
    }
  }, [orderId, clearCart])

  useEffect(() => {
    poll()
    return () => clearTimeout(timerRef.current)
  }, [poll])

  function retryPoll() {
    pollCountRef.current = 0
    setStatus('verifying')
    timerRef.current = setTimeout(poll, 500)
  }

  if (status === 'verifying') return <VerifyingState />
  if (status === 'paid')      return <PaidState orderId={orderId} />
  if (status === 'cancelled') return <CancelledState />
  if (status === 'timeout')   return <TimeoutState onRetry={retryPoll} orderId={orderId} />
  return <ErrorState />
}

/* ─── Estados ───────────────────────────────────────────── */

function VerifyingState() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
        <div className="w-9 h-9 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Verificando pago…</h1>
      <p className="text-sm text-gray-400">Esto puede tomar unos segundos.</p>
    </div>
  )
}

function PaidState({ orderId }) {
  const [copied, setCopied] = useState(false)
  const trackingUrl = `${TRACKING_BASE}/${orderId}`

  function copyLink() {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Pago confirmado!</h1>
      <p className="text-gray-500 leading-relaxed mb-6">
        Tu pedido fue recibido y el pago procesado correctamente.
        En breve nos pondremos en contacto para coordinar el envío.
      </p>

      {/* ID del pedido */}
      {orderId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            N.º de pedido
          </p>
          <p className="font-mono text-sm text-gray-800 break-all">{orderId}</p>
        </div>
      )}

      {/* Link de seguimiento */}
      {orderId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Link de seguimiento
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Guardá este link para rastrear el estado de tu pedido en cualquier momento.
          </p>
          <button
            onClick={copyLink}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                </svg>
                ¡Copiado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
                Copiar link de seguimiento
              </>
            )}
          </button>
        </div>
      )}

      <Link
        to="/petshop"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Seguir comprando
      </Link>
    </div>
  )
}

function CancelledState() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Pago no procesado</h1>
      <p className="text-gray-500 mb-8">
        El pedido fue cancelado. Podés volver a la tienda e intentarlo de nuevo.
      </p>
      <Link
        to="/petshop"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}

function TimeoutState({ onRetry, orderId }) {
  const [copied, setCopied] = useState(false)
  const trackingUrl = `${TRACKING_BASE}/${orderId}`

  function copyLink() {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Verificando tu pago…</h1>
      <p className="text-gray-500 leading-relaxed mb-6">
        La confirmación puede demorar unos minutos. Si ya completaste el pago,
        tu pedido fue recibido y te contactaremos pronto.
      </p>

      {orderId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Link de seguimiento
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Guardá este link para rastrear el estado de tu pedido en cualquier momento.
          </p>
          <button
            onClick={copyLink}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              copied ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {copied ? '¡Copiado!' : 'Copiar link de seguimiento'}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Verificar de nuevo
        </button>
        <Link
          to="/petshop"
          className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
      <p className="text-gray-500 mb-8">
        No pudimos verificar el estado de tu pedido. Si el problema persiste,
        contactanos.
      </p>
      <Link
        to="/petshop"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}
