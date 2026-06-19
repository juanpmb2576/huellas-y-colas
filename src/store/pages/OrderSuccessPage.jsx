import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
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
  if (status === 'paid')      return <PaidState />
  if (status === 'cancelled') return <CancelledState />
  if (status === 'timeout')   return <TimeoutState onRetry={retryPoll} />
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

function PaidState() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Pago confirmado!</h1>
      <p className="text-gray-500 leading-relaxed mb-8">
        Tu pedido fue recibido y el pago procesado correctamente.
        En breve nos pondremos en contacto para coordinar el envío.
      </p>
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

function TimeoutState({ onRetry }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Verificando tu pago…</h1>
      <p className="text-gray-500 leading-relaxed mb-8">
        La confirmación puede demorar unos minutos. Si ya completaste el pago,
        tu pedido fue recibido y te contactaremos pronto.
      </p>
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
