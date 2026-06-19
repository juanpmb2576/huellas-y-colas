import { Link } from 'react-router-dom'
import { clinicConfig } from '../clinicConfig'
import Logo from './components/Logo'

function PawDecor({ className }) {
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

export default function Hero() {
  return (
    <section id="inicio" className="relative bg-hc-primary overflow-hidden">

      {/* Decorative circles */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-24 -top-24 w-[480px] h-[480px] rounded-full bg-white/[0.04]"/>
        <div className="absolute -left-16 -bottom-16 w-[320px] h-[320px] rounded-full bg-hc-secondary/20"/>
        <PawDecor className="absolute right-10 bottom-16 w-32 h-32 text-white/[0.06] rotate-12"/>
        <PawDecor className="absolute left-8 top-12 w-20 h-20 text-hc-accent/20 -rotate-12"/>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-24 md:py-36 text-center">

        {/* City badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 font-body text-xs font-semibold uppercase tracking-widest text-white/75 mb-8">
          <PawDecor className="w-3.5 h-3.5 text-hc-accent"/>
          {clinicConfig.address.city}
        </div>

        {/* Logo grande */}
        <div className="flex justify-center mb-6">
          <Logo size="hero" light imageOnly />
        </div>

        <h1 className="font-display font-semibold text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-3xl mx-auto">
          {clinicConfig.name}
        </h1>

        <p className="mt-6 font-body text-white/65 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          {clinicConfig.tagline}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={clinicConfig.storeUrl}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-hc-accent hover:bg-hc-accent/90 text-white font-body font-bold text-sm rounded-xl transition-colors shadow-lg shadow-black/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
            </svg>
            Ver tienda online
          </Link>

          <a
            href={`https://wa.me/${clinicConfig.whatsapp}?text=${encodeURIComponent(clinicConfig.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-body font-semibold text-sm rounded-xl transition-colors border border-white/20"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Agendar por WhatsApp
          </a>
        </div>

        {/* Phone chip */}
        <div className="mt-8 flex items-center justify-center gap-2 font-body text-sm text-white/50">
          <svg className="w-4 h-4 text-hc-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
          </svg>
          <a href={`tel:${clinicConfig.phones[0].replace(/\s/g, '')}`} className="hover:text-white transition-colors">
            {clinicConfig.phones[0]}
          </a>
        </div>
      </div>

      {/* Wave transition */}
      <div className="relative h-12 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none" fill="var(--hc-background, #FAF3E8)">
          <path d="M0 48V0c240 32 480 48 720 48S1200 32 1440 0v48H0Z"/>
        </svg>
      </div>
    </section>
  )
}
