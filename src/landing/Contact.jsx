import { clinicConfig } from '../clinicConfig'

export default function Contact() {
  const { phones, whatsapp, whatsappMsg, instagram, instagramUrl, address } = clinicConfig

  return (
    <section id="contacto" className="bg-white py-20 px-5">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-hc-primary mb-3">
            Estamos aquí
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-hc-text">
            Contáctanos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center p-8 rounded-2xl bg-hc-bg border border-hc-neutral hover:border-hc-primary/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-4 group-hover:bg-[#25D366]/20 transition-colors">
              <svg className="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </div>
            <p className="font-display font-semibold text-hc-text mb-1">WhatsApp</p>
            <p className="font-body text-sm text-hc-text/55 mb-3">Escríbenos, respondemos rápido</p>
            <span className="font-body text-sm font-semibold text-hc-primary group-hover:text-hc-accent transition-colors">
              {phones[0]}
            </span>
          </a>

          {/* Teléfono */}
          <a
            href={`tel:${phones[0].replace(/\s/g, '')}`}
            className="group flex flex-col items-center text-center p-8 rounded-2xl bg-hc-bg border border-hc-neutral hover:border-hc-primary/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-2xl bg-hc-primary/10 flex items-center justify-center mb-4 group-hover:bg-hc-primary/20 transition-colors">
              <svg className="w-7 h-7 text-hc-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
              </svg>
            </div>
            <p className="font-display font-semibold text-hc-text mb-1">Teléfono</p>
            <p className="font-body text-sm text-hc-text/55 mb-3">Llámanos directamente</p>
            <span className="font-body text-sm font-semibold text-hc-primary group-hover:text-hc-accent transition-colors">
              {phones[0]}
            </span>
          </a>

          {/* Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center p-8 rounded-2xl bg-hc-bg border border-hc-neutral hover:border-hc-primary/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-200 sm:col-span-2 lg:col-span-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
              <svg className="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </div>
            <p className="font-display font-semibold text-hc-text mb-1">Instagram</p>
            <p className="font-body text-sm text-hc-text/55 mb-3">Síguenos y conoce más</p>
            <span className="font-body text-sm font-semibold text-hc-primary group-hover:text-hc-accent transition-colors">
              @{instagram}
            </span>
          </a>
        </div>

        {/* Mapa + dirección */}
        {address.embedUrl && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            {/* iframe */}
            <div className="rounded-2xl overflow-hidden border border-hc-neutral h-64 lg:h-auto min-h-64">
              <iframe
                src={address.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ubicación ${clinicConfig.name}`}
              />
            </div>

            {/* Dirección + botón */}
            <div className="flex flex-col justify-center gap-5 p-6 rounded-2xl bg-hc-bg border border-hc-neutral">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-hc-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-hc-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-body font-semibold text-hc-text">{address.street}</p>
                  <p className="font-body text-sm text-hc-text/55 mt-0.5">{address.city}</p>
                </div>
              </div>

              <a
                href={address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-hc-primary hover:bg-hc-primary/90 text-white font-body font-semibold text-sm rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"/>
                </svg>
                Cómo llegar
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
