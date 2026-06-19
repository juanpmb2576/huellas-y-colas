import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function PawIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <ellipse cx="9"    cy="7"    rx="3"   ry="3.8"/>
      <ellipse cx="16"   cy="6"    rx="2.8" ry="3.4"/>
      <ellipse cx="5"    cy="13"   rx="2.6" ry="3.2"/>
      <ellipse cx="20.5" cy="12.5" rx="2.6" ry="3.2"/>
      <path d="M12.5 12.5c-4.8 0-7.5 3-7.5 6.5 0 2.2 1.8 3.8 7.5 3.8s7.5-1.6 7.5-3.8c0-3.5-2.7-6.5-7.5-6.5z"/>
    </svg>
  )
}

export default function CartDrawer() {
  const { items, itemCount, total, isOpen, closeCart, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-96 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header verde manglar */}
        <div className="flex items-center justify-between px-5 py-4 bg-manglar shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-fraunces font-bold text-white text-lg">Carrito</h2>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 bg-ambar/20 text-ambar text-xs font-bold rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5 bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <PawIcon className="w-14 h-14 text-jade/20" />
              <p className="font-fraunces italic text-lg text-manglar/35">
                Por ahora, nada para las patitas.
              </p>
              <button
                onClick={closeCart}
                className="text-sm text-jade hover:text-jade/70 font-medium transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex items-start gap-3 pb-4 border-b border-arena last:border-0 last:pb-0">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-arena shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PawIcon className="w-7 h-7 text-jade/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-tierra leading-snug">{item.name}</p>
                    <p className="text-xs text-tierra/50 mt-0.5">
                      ${Number(item.price).toLocaleString('es-CO')} c/u
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-arena rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-tierra/60 hover:bg-arena transition-colors text-sm font-medium"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-tierra">
                          {item.quantity}
                        </span>
                        {(() => {
                          const atMax = item.stock !== null && item.stock !== undefined && item.quantity >= item.stock
                          return (
                            <button
                              onClick={() => updateQuantity(item.id, +1)}
                              disabled={atMax}
                              title={atMax ? `Stock máximo: ${item.stock}` : undefined}
                              className={`w-7 h-7 flex items-center justify-center transition-colors text-sm font-medium ${
                                atMax
                                  ? 'text-tierra/20 cursor-not-allowed'
                                  : 'text-tierra/60 hover:bg-arena'
                              }`}
                            >
                              +
                            </button>
                          )
                        })()}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-tierra/40 hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                      {item.stock !== null && item.stock !== undefined && item.quantity >= item.stock && (
                        <span className="text-[10px] text-ambar font-semibold">Máx.</span>
                      )}
                    </div>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-bold text-tierra shrink-0">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con CTA en ámbar */}
        {items.length > 0 && (
          <div className="border-t border-arena px-5 py-4 space-y-4 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-tierra/50 font-medium">Subtotal</p>
              <p className="font-bold text-xl text-tierra">
                ${total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </p>
            </div>
            <p className="text-xs text-tierra/40 -mt-2">
              Envío calculado en el siguiente paso
            </p>
            <Link
              to="/petshop/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3 bg-ambar hover:bg-ambar/90 text-tierra font-bold rounded-xl transition-colors"
            >
              Proceder al pago
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
