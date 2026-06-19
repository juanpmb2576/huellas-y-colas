import { Link } from 'react-router-dom'
import { clinicConfig } from '../clinicConfig'
import Navbar    from './Navbar'
import Hero      from './Hero'
import Services  from './Services'
import Contact   from './Contact'
import Footer    from './Footer'

function StoreCTA() {
  return (
    <section className="bg-hc-accent py-14 px-5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="font-display font-semibold text-2xl sm:text-3xl text-white">
            ¿Buscás productos para tu mascota?
          </p>
          <p className="font-body text-white/70 mt-2 text-sm">
            Alimentos, accesorios y más · Pedido online, entrega en Cartagena.
          </p>
        </div>
        <Link
          to={clinicConfig.storeUrl}
          className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-hc-primary hover:bg-hc-primary/90 text-white font-body font-bold text-sm rounded-xl transition-colors shadow-md"
        >
          Ir a la tienda
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="font-body text-hc-text bg-hc-bg min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <StoreCTA />
      <Contact />
      <Footer />
    </div>
  )
}
