import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clinicConfig } from '../clinicConfig'
import Logo from './components/Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-hc-primary/95 backdrop-blur-sm border-b border-white/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

        <a href="#inicio" onClick={() => setOpen(false)}>
          <Logo size="md" light />
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-7 font-body text-sm font-medium">
          <a href="#servicios" className="text-white/70 hover:text-white transition-colors">Servicios</a>
          <a href="#contacto"  className="text-white/70 hover:text-white transition-colors">Contacto</a>
          <Link
            to={clinicConfig.storeUrl}
            className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
          >
            Tienda online
            <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:block shrink-0">
          <a
            href={`https://wa.me/${clinicConfig.whatsapp}?text=${encodeURIComponent(clinicConfig.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-semibold text-white bg-hc-accent hover:bg-hc-accent/90 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.855L.057 23.882a.5.5 0 0 0 .614.637l6.256-1.637A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.877 9.877 0 0 1-5.031-1.375l-.36-.214-3.733.977.997-3.645-.234-.374A9.869 9.869 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/>
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-white"
          aria-label="Menú"
          aria-expanded={open}
        >
          <span className={`block w-5 h-0.5 bg-white transition-transform origin-center ${open ? 'translate-y-2 rotate-45' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-white transition-transform origin-center ${open ? '-translate-y-2 -rotate-45' : ''}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-hc-primary border-t border-white/10 px-5 py-4 flex flex-col gap-4 font-body text-sm font-medium">
          <a href="#servicios" onClick={() => setOpen(false)} className="text-white/80 hover:text-white">Servicios</a>
          <a href="#contacto"  onClick={() => setOpen(false)} className="text-white/80 hover:text-white">Contacto</a>
          <Link
            to={clinicConfig.storeUrl}
            onClick={() => setOpen(false)}
            className="text-hc-accent hover:text-hc-accent/80 font-semibold"
          >
            Tienda online →
          </Link>
          <a
            href={`https://wa.me/${clinicConfig.whatsapp}?text=${encodeURIComponent(clinicConfig.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-white bg-hc-accent/90 hover:bg-hc-accent px-4 py-2 rounded-lg font-semibold transition-colors self-start"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.855L.057 23.882a.5.5 0 0 0 .614.637l6.256-1.637A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.877 9.877 0 0 1-5.031-1.375l-.36-.214-3.733.977.997-3.645-.234-.374A9.869 9.869 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
