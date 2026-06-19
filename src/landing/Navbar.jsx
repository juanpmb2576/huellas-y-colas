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
            className="font-body text-sm font-semibold text-white bg-hc-accent hover:bg-hc-accent/90 px-4 py-2 rounded-lg transition-colors"
          >
            {clinicConfig.phones[0]}
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
        </div>
      )}
    </header>
  )
}
