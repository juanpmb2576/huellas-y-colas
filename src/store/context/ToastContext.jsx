import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useCart } from './CartContext'

const ToastCtx = createContext(null)

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

function Toast({ toast, onDismiss }) {
  const { openCart } = useCart()

  if (!toast) return null

  function handleViewCart() {
    openCart()
    onDismiss()
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-0 right-0 flex justify-center z-[60] pointer-events-none px-4"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 bg-manglar text-white rounded-2xl shadow-xl px-4 py-3 max-w-sm w-full"
        style={{ animation: 'toast-in 0.25s ease-out' }}
      >
        <PawIcon className="w-6 h-6 shrink-0 text-ambar" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-none mb-0.5">¡Agregado al carrito!</p>
          <p className="text-[12px] text-white/70 leading-none truncate">{toast.name}</p>
        </div>
        <button
          onClick={handleViewCart}
          className="shrink-0 bg-ambar hover:bg-ambar/85 text-tierra text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Ver carrito →
        </button>
      </div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((product) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ name: product.name, key: Date.now() })
    timerRef.current = setTimeout(() => setToast(null), 3500)
  }, [])

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} onDismiss={dismiss} />
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
