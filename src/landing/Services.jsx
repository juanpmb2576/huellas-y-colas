import { clinicConfig } from '../clinicConfig'

function ServiceIcon({ type, className }) {
  switch (type) {
    case 'stethoscope':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 3v6a6 6 0 0 0 12 0V3"/>
          <path d="M12 15v1a4 4 0 0 0 4 4h1"/>
          <circle cx="19" cy="20" r="2" strokeWidth="2"/>
        </svg>
      )
    case 'bag':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      )
    case 'tag':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42L12.586 2.586Z"/>
          <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      )
    case 'home':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    case 'clock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 6.5v5.5l3.5 2.5"/>
          <path d="M12 3v1.5M12 19.5V21M3 12H4.5M19.5 12H21"/>
        </svg>
      )
    default:
      return null
  }
}

export default function Services() {
  const { services } = clinicConfig
  const isOdd = services.length % 2 !== 0

  return (
    <section id="servicios" className="bg-hc-bg py-20 px-5">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-hc-primary mb-3">
            Lo que hacemos
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-hc-text">
            Nuestros servicios
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <div
              key={svc.id}
              className={[
                'group bg-white rounded-2xl p-7 border border-hc-neutral',
                'hover:border-hc-primary/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]',
                'transition-all duration-200',
                isOdd && i === services.length - 1 ? 'sm:col-span-2 lg:col-span-1' : '',
              ].join(' ')}
            >
              <div className="w-12 h-12 rounded-xl bg-hc-primary/10 flex items-center justify-center mb-5 group-hover:bg-hc-primary/20 transition-colors">
                <ServiceIcon type={svc.icon} className="w-6 h-6 text-hc-primary"/>
              </div>
              <h3 className="font-display font-semibold text-xl text-hc-text mb-2">{svc.title}</h3>
              <p className="font-body text-hc-text/55 text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
