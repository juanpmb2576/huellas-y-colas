import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

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

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const { addItem, items } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single()
      setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  function handleAdd() {
    if (!product || outOfStock || maxReached) return
    addItem(product)
    showToast(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const cartQty   = items.find(i => i.id === product?.id)?.quantity ?? 0
  const outOfStock = product?.stock === 0
  const maxReached = !outOfStock && product?.stock !== null && cartQty >= (product?.stock ?? Infinity)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-4 w-24 bg-arena rounded animate-pulse mb-8"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-arena rounded-3xl animate-pulse"/>
          <div className="space-y-4 pt-2">
            <div className="h-3 w-20 bg-arena rounded animate-pulse"/>
            <div className="h-8 bg-arena rounded animate-pulse"/>
            <div className="h-8 w-1/3 bg-arena rounded animate-pulse"/>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-arena/70 rounded animate-pulse"/>
              <div className="h-3 bg-arena/70 rounded animate-pulse"/>
              <div className="h-3 w-2/3 bg-arena/70 rounded animate-pulse"/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <PawIcon className="w-16 h-16 text-manglar/20 mx-auto mb-4"/>
        <p className="font-fraunces italic text-xl text-manglar/40">Producto no encontrado.</p>
        <Link to="/petshop" className="mt-4 inline-block text-sm text-jade hover:text-jade/70 font-medium transition-colors">
          ← Volver a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        to="/petshop"
        className="inline-flex items-center gap-1.5 text-sm text-tierra/50 hover:text-tierra transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
        </svg>
        Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

        {/* Imagen */}
        <div className="relative aspect-square bg-arena/40 rounded-3xl overflow-hidden">
          <PawIcon className="absolute top-3 right-3 w-12 h-12 text-manglar/[0.07]"/>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full h-full object-cover ${outOfStock ? '[filter:grayscale(1)_sepia(0.12)]' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PawIcon className="w-20 h-20 text-jade/25"/>
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-end p-4">
              <span className="bg-arena text-tierra/60 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {product.categories?.name && (
            <p className="text-xs font-semibold text-jade uppercase tracking-widest">
              {product.categories.name}
            </p>
          )}

          <h1 className="font-fraunces text-2xl sm:text-3xl text-tierra font-semibold leading-tight">
            {product.name}
          </h1>

          <p className="font-bold text-3xl text-tierra">
            ${Number(product.price).toLocaleString('es-CO', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>

          {product.description && (
            <p className="font-body text-sm text-tierra/65 leading-relaxed">
              {product.description}
            </p>
          )}

          {product.stock !== null && product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-ambar font-semibold">
              ¡Solo quedan {product.stock} disponibles!
            </p>
          )}

          {outOfStock ? (
            <div className="py-3 px-4 bg-arena/60 rounded-xl text-sm text-tierra/50 text-center font-medium">
              Producto sin stock por el momento
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={maxReached}
              title={maxReached ? `Stock máximo alcanzado (${product.stock} disponibles)` : undefined}
              className={`mt-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                maxReached
                  ? 'bg-arena text-tierra/40 cursor-not-allowed'
                  : added
                  ? 'bg-jade text-white'
                  : 'bg-manglar text-lino hover:bg-manglar/90'
              }`}
            >
              {added ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                  </svg>
                  ¡Agregado!
                </>
              ) : maxReached ? 'Stock máximo alcanzado' : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  Agregar al carrito
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
