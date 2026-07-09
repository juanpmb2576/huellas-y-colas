import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

// ─── Íconos SVG por categoría (reservados para uso interno) ──
// No se usan en el selector de categorías; la función de detección
// por keywords permanece intacta para otros usos futuros.

function IconTodos({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3"  y="3"  width="7" height="7" rx="1.5"/>
      <rect x="14" y="3"  width="7" height="7" rx="1.5"/>
      <rect x="3"  y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

function IconPerros({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="8.5"  cy="5.5"  rx="2.2" ry="2.8"/>
      <ellipse cx="14.5" cy="5"    rx="2"   ry="2.5"/>
      <ellipse cx="4.5"  cy="10.5" rx="1.9" ry="2.4"/>
      <ellipse cx="18.5" cy="10"   rx="1.9" ry="2.4"/>
      <path d="M11.5 10.5c-4 0-6.5 2.6-6.5 5.8 0 2 1.6 3.2 6.5 3.2s6.5-1.2 6.5-3.2c0-3.2-2.5-5.8-6.5-5.8z"/>
    </svg>
  )
}

function IconGatos({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 10 L5.5 4 L10 9.5"/>
      <path d="M18.5 10 L18.5 4 L14 9.5"/>
      <circle cx="12" cy="14" r="6.5"/>
      <circle cx="9.5"  cy="13.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="13.5" r="1" fill="currentColor" stroke="none"/>
      <line x1="2.5"  y1="14"   x2="8"    y2="14.5"/>
      <line x1="16"   y1="14.5" x2="21.5" y2="14"/>
    </svg>
  )
}

function IconAves({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="10" cy="15" rx="5.5" ry="4.5"/>
      <circle cx="17" cy="9.5" r="3.5"/>
      <path d="M20 9 L23 8.5 L20 11" fill="currentColor" strokeWidth="1"/>
      <circle cx="18.5" cy="9" r="0.9" fill="currentColor" stroke="none"/>
      <path d="M9 13 Q5.5 10 3 12"/>
    </svg>
  )
}

function IconPeces({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 12 L2 8 M5.5 12 L2 16"/>
      <ellipse cx="13.5" cy="12" rx="7" ry="5"/>
      <circle cx="18" cy="11" r="1.1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function IconRoedores({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8"  cy="7" r="3"/>
      <circle cx="16" cy="7" r="3"/>
      <ellipse cx="12" cy="14.5" rx="7" ry="6"/>
      <circle cx="9.5"  cy="13.5" r="1"   fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="13.5" r="1"   fill="currentColor" stroke="none"/>
      <circle cx="12"   cy="16.5" r="0.8" fill="currentColor" stroke="none"/>
      <path d="M19 18 Q23 18 22 22"/>
    </svg>
  )
}

function getCategoryIcon(category, className = 'w-4 h-4 shrink-0') {
  const key = (category.slug || category.name || '').toLowerCase()
  if (/perro|dog|canin/.test(key))                return <IconPerros    className={className} />
  if (/gato|cat|felin/.test(key))                 return <IconGatos     className={className} />
  if (/ave|bird|p[aá]jaro|pluma/.test(key))      return <IconAves      className={className} />
  if (/pe[cz]|fish|acuario|aqua/.test(key))      return <IconPeces     className={className} />
  if (/roedor|hamster|rat[oó]n|conejo/.test(key)) return <IconRoedores  className={className} />
  return <IconPerros className={className} />
}

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

// ─── Skeleton card ───────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-arena shadow-sm">
      <div className="aspect-square bg-arena animate-pulse" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3.5 bg-arena rounded animate-pulse" />
        <div className="h-3.5 bg-arena rounded animate-pulse w-3/4" />
        <div className="h-5 bg-arena rounded animate-pulse w-2/5" />
        <div className="h-9 bg-arena/60 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

// ─── Estado vacío ────────────────────────────────────────────

function EmptyState({ catName, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full bg-hc-secondary/25 blur-2xl" aria-hidden/>
        <PawDecor className="relative w-24 h-24 text-manglar/20"/>
      </div>
      <div>
        <p className="font-fraunces italic text-xl text-manglar/45">
          {catName ? `Nada en ${catName} por ahora.` : 'Sin productos disponibles.'}
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="mt-3 text-sm text-jade hover:text-jade/70 font-medium transition-colors"
          >
            Ver todas las categorías →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  // null = todos los productos; objeto {id,name,slug} = filtrado por categoría
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('id, name, slug').order('name'),
        supabase
          .from('products')
          .select('*, categories(name)')
          .eq('active', true)
          .order('created_at', { ascending: false }),
      ])
      setCategories(cats ?? [])
      setProducts(prods ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory.id)
    : products

  return (
    <>
      {/* Banner con decoración de marca */}
      <div className="relative bg-manglar overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/[0.04]"/>
          <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-hc-secondary/20"/>
          <PawDecor className="absolute right-10 bottom-8 w-28 h-28 text-white/[0.06] rotate-12"/>
          <PawDecor className="absolute left-6  top-4  w-16 h-16 text-hc-accent/20 -rotate-12"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
          <p className="font-fraunces italic text-2xl sm:text-3xl text-white/90">
            Para los que los tratan como familia.
          </p>
        </div>
        <div className="relative h-10 overflow-hidden" aria-hidden>
          <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full" preserveAspectRatio="none" fill="var(--hc-background, #FAF3E8)">
            <path d="M0 40V0c240 26 480 40 720 40S1200 26 1440 0v40H0Z"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Selector de categorías — texto dinámico, sin íconos */}
        {!loading && categories.length > 0 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                !selectedCategory
                  ? 'bg-manglar text-lino'
                  : 'text-tierra/55 hover:text-tierra hover:bg-arena/60'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                  selectedCategory?.id === cat.id
                    ? 'bg-manglar text-lino'
                    : 'text-tierra/55 hover:text-tierra hover:bg-arena/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>

        ) : filtered.length === 0 ? (
          <EmptyState
            catName={selectedCategory?.name ?? null}
            onReset={selectedCategory ? () => setSelectedCategory(null) : null}
          />

        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addItem} />
            ))}
          </div>
        )}

      </div>
    </>
  )
}
