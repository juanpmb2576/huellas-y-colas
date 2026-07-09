import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

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

export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false)
  const { items } = useCart()
  const { showToast } = useToast()

  const cartQty   = items.find(i => i.id === product.id)?.quantity ?? 0
  const outOfStock = product.stock === 0
  const maxReached = !outOfStock && product.stock !== null && cartQty >= product.stock

  function handleAdd() {
    if (outOfStock || maxReached) return
    onAdd(product)
    showToast(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className={`group bg-white rounded-3xl overflow-hidden border flex flex-col transition-all duration-200 shadow-sm ${
      outOfStock
        ? 'border-arena/60 opacity-90'
        : 'border-arena hover:border-ambar/50 hover:shadow-[0_6px_28px_rgba(0,0,0,0.10)] cursor-pointer'
    }`}>

      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-arena/40">
        {/* Huella decorativa en esquina */}
        <PawIcon className="absolute top-2 right-2 w-10 h-10 text-manglar/[0.07] pointer-events-none" aria-hidden />

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              !outOfStock ? 'group-hover:scale-[1.04]' : ''
            }`}
            style={outOfStock ? { filter: 'grayscale(1) sepia(0.12)' } : undefined}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PawIcon className="w-12 h-12 text-jade/30" />
          </div>
        )}

        {/* Cinta diagonal "Sin stock" */}
        {outOfStock && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div
              className="absolute text-center font-semibold uppercase"
              style={{
                background: 'var(--color-arena)',
                color: 'color-mix(in srgb, var(--color-tierra) 60%, transparent)',
                fontSize: '9px',
                letterSpacing: '0.12em',
                padding: '5px 0',
                width: '140px',
                top: '22px',
                left: '-32px',
                transform: 'rotate(-45deg)',
              }}
            >
              Sin stock
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1">
        {product.categories?.name && (
          <p className="text-[10px] font-semibold text-jade uppercase tracking-widest mb-1">
            {product.categories.name}
          </p>
        )}

        <div className="flex-1">
          <h3 className={`text-sm font-semibold leading-snug line-clamp-2 ${
            outOfStock ? 'text-tierra/40' : 'text-tierra'
          }`}>
            {product.name}
          </h3>
          {product.description && (
            <p className={`text-xs font-body leading-snug line-clamp-2 mt-0.5 ${
              outOfStock ? 'text-tierra/25' : 'text-tierra/55'
            }`}>
              {product.description}
            </p>
          )}
        </div>

        <p className={`font-bold text-[17px] mt-1.5 ${outOfStock ? 'text-tierra/30' : 'text-tierra'}`}>
          ${Number(product.price).toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </p>

        {!outOfStock && (
          <button
            onClick={handleAdd}
            disabled={maxReached}
            title={maxReached ? `Stock máximo alcanzado (${product.stock} disponibles)` : undefined}
            className={`mt-3 w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
              maxReached
                ? 'bg-arena text-tierra/40 cursor-not-allowed'
                : added
                ? 'bg-jade text-white scale-[0.97]'
                : 'bg-manglar text-lino hover:bg-manglar/90'
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Listo
              </span>
            ) : maxReached ? 'Stock máx.' : (
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
