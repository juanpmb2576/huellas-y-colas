import { useState } from 'react'
import { clinicConfig } from '../../clinicConfig'

function PawIcon({ className }) {
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

const sizes = {
  sm:   { img: 'w-8 h-8',   name: 'text-base', city: 'text-[10px]' },
  md:   { img: 'w-10 h-10', name: 'text-lg',   city: 'text-xs'     },
  lg:   { img: 'w-14 h-14', name: 'text-2xl',  city: 'text-sm'     },
  hero: { img: 'w-28 h-28', name: 'text-4xl',  city: 'text-base'   },
}

// light=true → on dark (primary) background; light=false → on light background
// imageOnly=true → solo la imagen/icono, sin texto de nombre ni ciudad
export default function Logo({ size = 'md', light = false, imageOnly = false }) {
  const [imgOk, setImgOk] = useState(true)
  const s = sizes[size]

  const image = imgOk ? (
    <img
      src={clinicConfig.logo}
      alt={clinicConfig.name}
      className={`${s.img} object-contain`}
      onError={() => setImgOk(false)}
    />
  ) : (
    <PawIcon className={`${s.img} ${light ? 'text-white/80' : 'text-hc-accent'} shrink-0`} />
  )

  if (imageOnly) return image

  return (
    <div className="flex items-center gap-2.5">
      {image}
      <div>
        <p className={`font-display font-semibold leading-none tracking-tight ${s.name} ${light ? 'text-white' : 'text-hc-text'}`}>
          {clinicConfig.name}
        </p>
        <p className={`leading-none mt-0.5 font-body ${s.city} ${light ? 'text-white/55' : 'text-hc-primary/70'}`}>
          {clinicConfig.address.city.split(',')[0]}
        </p>
      </div>
    </div>
  )
}
