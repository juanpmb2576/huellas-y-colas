import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clinicConfig } from '../clinicConfig'

// ─── Ícono pata ─────────────────────────────────────────────
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

// ─── Íconos de servicio ──────────────────────────────────────
function ServiceIcon({ type, className }) {
  switch (type) {
    case 'clock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 6.5v5.5l3.5 2.5"/>
          <path d="M12 3v1.5M12 19.5V21M3 12H4.5M19.5 12H21"/>
        </svg>
      )
    case 'bolt':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2z"/>
        </svg>
      )
    case 'bed':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v10M3 12h18M21 7v10"/>
          <rect x="3" y="7" width="18" height="5" rx="2"/>
          <circle cx="7.5" cy="9.5" r="1.2" fill="currentColor" stroke="none"/>
        </svg>
      )
    case 'scissors':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6"  cy="6"  r="3"/>
          <circle cx="6"  cy="18" r="3"/>
          <path d="M8.7 8.7 21 3"/>
          <path d="M8.7 15.3 21 21"/>
          <path d="M21 3 8.7 15.3"/>
        </svg>
      )
    case 'stethoscope':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v6a6 6 0 0 0 12 0V3"/>
          <path d="M12 15a5 5 0 0 0 5 5h1a2 2 0 0 0 0-4h-1"/>
          <circle cx="19" cy="20" r="2" strokeWidth="2"/>
        </svg>
      )
    default:
      return <PawIcon className={className} />
  }
}

// ─── Logo con fallback ───────────────────────────────────────
function Logo({ size = 'md', dark = false }) {
  const [imgOk, setImgOk] = useState(true)
  useEffect(() => { setImgOk(true) }, [])

  const sizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-12 h-12' }
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }
  const subSizes  = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }

  return (
    <div className="flex items-center gap-2.5">
      {imgOk ? (
        <img
          src={clinicConfig.logo}
          alt={clinicConfig.name}
          className={`${sizes[size]} object-contain`}
          onError={() => setImgOk(false)}
        />
      ) : (
        <PawIcon className={`${sizes[size]} text-ambar shrink-0`} />
      )}
      <div>
        <p className={`font-fraunces font-bold leading-none tracking-tight ${textSizes[size]} ${dark ? 'text-tierra' : 'text-white'}`}>
          {clinicConfig.name}
        </p>
        <p className={`font-medium leading-none mt-0.5 ${subSizes[size]} ${dark ? 'text-tierra/50' : 'text-jade'}`}>
          {clinicConfig.address.city.split(',')[0]}
        </p>
      </div>
    </div>
  )
}

// ─── Landing Page ────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({
    nombre: '', telefono: '', mascota: '', servicio: '', fecha: ''
  })
  const [sent, setSent] = useState(false)

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim() || !form.mascota.trim() || !form.servicio) return

    const text = `Hola! Me gustaría agendar una cita en ${clinicConfig.name}.

Nombre: ${form.nombre}
Teléfono: ${form.telefono}
Mascota: ${form.mascota}
Servicio: ${form.servicio}
${form.fecha ? `Fecha preferida: ${form.fecha}` : ''}

¡Gracias!`

    window.open(
      `https://wa.me/${clinicConfig.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="font-sans text-tierra bg-lino min-h-screen">

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-manglar/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

          <a href="#inicio" onClick={() => setMenuOpen(false)}>
            <Logo size="sm" />
          </a>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#servicios" className="text-white/70 hover:text-white transition-colors">Servicios</a>
            <a href="#contacto"  className="text-white/70 hover:text-white transition-colors">Contacto</a>
            <Link to={clinicConfig.storeUrl} className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
              Tienda online
              <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${clinicConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-tierra bg-ambar hover:bg-ambar/90 px-4 py-2 rounded-lg transition-colors"
            >
              {clinicConfig.phones[0]}
            </a>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-white"
            aria-label="Menú"
          >
            <span className={`block w-5 h-0.5 bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-manglar border-t border-white/10 px-5 py-4 flex flex-col gap-4 text-sm font-medium">
            <a href="#servicios" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white">Servicios</a>
            <a href="#contacto"  onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white">Contacto</a>
            <a href="#agendar"   onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white">Agendar cita</a>
            <Link to={clinicConfig.storeUrl} className="text-ambar hover:text-ambar/80 font-semibold" onClick={() => setMenuOpen(false)}>
              Tienda online →
            </Link>
          </div>
        )}
      </header>


      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="inicio" className="relative bg-manglar overflow-hidden">
        {/* Decorative arcs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <svg className="absolute -right-20 -top-20 w-[480px] h-[480px] text-white/[0.03]" viewBox="0 0 400 400" fill="currentColor">
            <circle cx="200" cy="200" r="200"/>
          </svg>
          <svg className="absolute -left-16 bottom-0 w-[320px] h-[320px] text-jade/10" viewBox="0 0 400 400" fill="currentColor">
            <circle cx="200" cy="200" r="200"/>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-32 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-jade text-xs font-semibold uppercase tracking-widest mb-8">
            <PawIcon className="w-3.5 h-3.5 text-ambar" />
            {clinicConfig.address.city}
          </div>

          <h1 className="font-fraunces font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl mx-auto">
            {clinicConfig.name}
          </h1>

          <p className="mt-6 text-white/65 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            {clinicConfig.tagline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#agendar"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-ambar hover:bg-ambar/90 text-tierra font-bold text-sm rounded-xl transition-colors shadow-lg shadow-ambar/20"
            >
              Agendar cita por WhatsApp
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <Link
              to={clinicConfig.storeUrl}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-colors border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              Ver tienda online
            </Link>
          </div>

          {/* Phone chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {clinicConfig.phones.map(phone => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 text-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                {phone}
              </a>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none" fill="#F8F3EB">
            <path d="M0 48V0c240 32 480 48 720 48S1200 32 1440 0v48H0Z"/>
          </svg>
        </div>
      </section>


      {/* ── SERVICIOS ────────────────────────────────────────── */}
      <section id="servicios" className="bg-lino py-20 px-5">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-jade mb-3">Lo que hacemos</p>
            <h2 className="font-fraunces font-bold text-3xl sm:text-4xl text-manglar">Nuestros servicios</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clinicConfig.services.map((svc, i) => (
              <div
                key={svc.id}
                className={`group bg-white rounded-2xl p-7 border border-arena hover:border-jade/30 hover:shadow-[0_4px_24px_rgba(13,59,46,0.08)] transition-all duration-200 ${
                  // Centra la última tarjeta si el número es impar
                  clinicConfig.services.length % 2 !== 0 && i === clinicConfig.services.length - 1
                    ? 'sm:col-span-2 lg:col-span-1'
                    : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-jade/10 flex items-center justify-center mb-5 group-hover:bg-jade/20 transition-colors">
                  <ServiceIcon type={svc.icon} className="w-6 h-6 text-jade" />
                </div>
                <h3 className="font-fraunces font-bold text-xl text-manglar mb-2">{svc.title}</h3>
                <p className="text-tierra/60 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA TIENDA ───────────────────────────────────────── */}
      <section className="bg-ambar py-14 px-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="font-fraunces font-bold text-2xl sm:text-3xl text-tierra">¿Buscás productos para tu mascota?</p>
            <p className="text-tierra/65 mt-2 text-sm">Alimentos, accesorios y más. Pedido online, entrega en Cartagena.</p>
          </div>
          <Link
            to={clinicConfig.storeUrl}
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-manglar hover:bg-manglar/90 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
          >
            Ir a la tienda
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>


      {/* ── CONTACTO ─────────────────────────────────────────── */}
      <section id="contacto" className="bg-white py-20 px-5">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-jade mb-3">Estamos aquí</p>
            <h2 className="font-fraunces font-bold text-3xl sm:text-4xl text-manglar">Contáctanos</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Info */}
            <div className="space-y-8">

              {/* Teléfonos */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-tierra/40 mb-4">Teléfonos</p>
                <div className="space-y-3">
                  {clinicConfig.phones.map((phone, i) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-jade/10 flex items-center justify-center group-hover:bg-jade/20 transition-colors shrink-0">
                        <svg className="w-5 h-5 text-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-tierra/40 font-medium uppercase tracking-wider">
                          {i === 0 ? 'Principal' : 'Alternativo'}
                        </p>
                        <p className="text-lg font-semibold text-tierra group-hover:text-manglar transition-colors">
                          {phone}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Dirección */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-tierra/40 mb-4">Dirección</p>
                <a
                  href={clinicConfig.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-jade/10 flex items-center justify-center group-hover:bg-jade/20 transition-colors shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-tierra font-medium group-hover:text-manglar transition-colors">{clinicConfig.address.street}</p>
                    <p className="text-sm text-tierra/50 mt-0.5">{clinicConfig.address.city}</p>
                    <p className="text-xs text-jade mt-1.5 font-medium">Ver en Google Maps →</p>
                  </div>
                </a>
              </div>

              {/* Instagram */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-tierra/40 mb-4">Redes sociales</p>
                <a
                  href={clinicConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-jade/10 flex items-center justify-center group-hover:bg-jade/20 transition-colors shrink-0">
                    <svg className="w-5 h-5 text-jade" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-tierra font-medium group-hover:text-manglar transition-colors">@{clinicConfig.instagram}</p>
                    <p className="text-xs text-jade mt-1 font-medium">Seguirnos en Instagram →</p>
                  </div>
                </a>
              </div>

            </div>

            {/* Mapa */}
            <div className="rounded-2xl overflow-hidden border border-arena shadow-sm h-80 lg:h-[420px]">
              <iframe
                src={clinicConfig.address.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ubicación ${clinicConfig.name}`}
              />
            </div>

          </div>
        </div>
      </section>


      {/* ── FORMULARIO WHATSAPP ───────────────────────────────── */}
      <section id="agendar" className="bg-lino py-20 px-5">
        <div className="max-w-xl mx-auto">

          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-jade mb-3">Sin esperas</p>
            <h2 className="font-fraunces font-bold text-3xl sm:text-4xl text-manglar">Agendar cita</h2>
            <p className="text-tierra/55 mt-3 text-sm leading-relaxed">
              Completá el formulario y te redirigimos a WhatsApp con toda la info lista para enviar.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-2xl border border-arena p-7 space-y-5 shadow-sm"
          >

            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-tierra">
                Tu nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setField('nombre', e.target.value)}
                required
                placeholder="María González"
                className="w-full px-4 py-2.5 text-sm border border-arena rounded-xl outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition placeholder:text-tierra/30"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-tierra">
                Teléfono <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={e => setField('telefono', e.target.value)}
                required
                placeholder="+57 300 000 0000"
                className="w-full px-4 py-2.5 text-sm border border-arena rounded-xl outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition placeholder:text-tierra/30"
              />
            </div>

            {/* Mascota */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-tierra">
                Nombre y tipo de mascota <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.mascota}
                onChange={e => setField('mascota', e.target.value)}
                required
                placeholder="Max, perro golden retriever"
                className="w-full px-4 py-2.5 text-sm border border-arena rounded-xl outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition placeholder:text-tierra/30"
              />
            </div>

            {/* Servicio */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-tierra">
                Servicio requerido <span className="text-red-400">*</span>
              </label>
              <select
                value={form.servicio}
                onChange={e => setField('servicio', e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm border border-arena rounded-xl outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition bg-white text-tierra"
              >
                <option value="">Seleccioná un servicio…</option>
                {clinicConfig.services.map(svc => (
                  <option key={svc.id} value={svc.title}>{svc.title}</option>
                ))}
              </select>
            </div>

            {/* Fecha preferida */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-tierra">
                Fecha preferida{' '}
                <span className="text-tierra/40 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.fecha}
                onChange={e => setField('fecha', e.target.value)}
                placeholder="Ej: martes 24 de junio, por la mañana"
                className="w-full px-4 py-2.5 text-sm border border-arena rounded-xl outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition placeholder:text-tierra/30"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-manglar hover:bg-manglar/90 text-white font-bold text-sm rounded-xl transition-colors mt-2"
            >
              {/* WhatsApp icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Enviar por WhatsApp
            </button>

            {sent && (
              <p className="text-center text-sm text-jade font-medium pt-1">
                ¡Listo! Se abrió WhatsApp con el mensaje. Si no abrió,{' '}
                <a
                  href={`https://wa.me/${clinicConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  hacé clic aquí
                </a>
                .
              </p>
            )}
          </form>
        </div>
      </section>


      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-manglar px-5 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-white/10">

            {/* Marca */}
            <div className="max-w-xs">
              <Logo size="md" />
              <p className="mt-4 text-sm text-white/45 leading-relaxed">{clinicConfig.tagline}</p>
              <a
                href={clinicConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-jade hover:text-jade/80 transition-colors font-medium"
              >
                @{clinicConfig.instagram}
              </a>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-10 text-sm">
              <div>
                <p className="text-white/30 font-semibold uppercase tracking-widest text-xs mb-4">Servicios</p>
                <ul className="space-y-2.5">
                  {clinicConfig.services.map(svc => (
                    <li key={svc.id}>
                      <a href="#servicios" className="text-white/55 hover:text-white transition-colors">{svc.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-white/30 font-semibold uppercase tracking-widest text-xs mb-4">Contacto</p>
                <ul className="space-y-2.5">
                  {clinicConfig.phones.map(phone => (
                    <li key={phone}>
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-white/55 hover:text-white transition-colors">{phone}</a>
                    </li>
                  ))}
                  <li className="text-white/40 text-xs mt-1 leading-snug">{clinicConfig.address.city}</li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} {clinicConfig.name}. Todos los derechos reservados.</p>
            <Link to={clinicConfig.storeUrl} className="hover:text-white/60 transition-colors">
              Tienda online →
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
