import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { clinicConfig } from '../../clinicConfig'

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

export default function Header() {
  const { itemCount, openCart } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-manglar shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Lado izquierdo: back link + logo tienda */}
        <div className="flex items-center gap-3 min-w-0">

          {/* Volver a la clínica */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white/45 hover:text-white/90 transition-colors shrink-0 group"
            title={`Volver a ${clinicConfig.name}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">{clinicConfig.shortName}</span>
          </Link>

          {/* Separador */}
          <span className="w-px h-5 bg-white/15 shrink-0" aria-hidden="true" />

          {/* Logo tienda */}
          <Link to="/petshop" className="flex items-center gap-3 min-w-0">
            <PawIcon className="w-8 h-8 text-ambar shrink-0" />
            <div className="min-w-0">
              <p className="font-fraunces font-bold text-white text-[18px] leading-none tracking-tight">
                {clinicConfig.name}
              </p>
              <p className="text-[11px] text-jade font-medium leading-none mt-1">
                {clinicConfig.address.city.split(',')[0]}
              </p>
            </div>
          </Link>
        </div>

        {/* Carrito */}
        <button
          onClick={openCart}
          aria-label={`Carrito (${itemCount} items)`}
          className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-ambar text-tierra text-[10px] font-bold rounded-full flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>

      </div>
    </header>
  )
}
