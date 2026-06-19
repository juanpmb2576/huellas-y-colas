import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'

const STOCK_LOW = 5

const STOCK_OPTS = [
  { key: 'all', label: 'Todo el stock' },
  { key: 'in',  label: 'En stock'      },
  { key: 'low', label: `Stock bajo (≤${STOCK_LOW})` },
  { key: 'out', label: 'Agotados'      },
]

function stockColor(stock) {
  if (stock === 0)          return 'text-red-500 font-semibold'
  if (stock <= STOCK_LOW)   return 'text-amber-600 font-semibold'
  return 'text-gray-700'
}

export default function ProductsAdminPage() {
  const [products, setProducts]           = useState([])
  const [categories, setCategories]       = useState([])
  const [loading, setLoading]             = useState(true)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [searchQuery, setSearchQuery]         = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [stockFilter, setStockFilter]         = useState('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('id, name').order('name'),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
    ])
    setCategories(cats ?? [])
    setProducts(prods ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() { setEditingProduct(null); setModalOpen(true) }
  function openEdit(p)  { setEditingProduct(p);    setModalOpen(true) }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  function handleSave() { setModalOpen(false); fetchData() }

  function clearFilters() {
    setSearchQuery('')
    setFilterCategoryId('')
    setStockFilter('all')
  }

  const hasActiveFilters = searchQuery || filterCategoryId || stockFilter !== 'all'

  const filtered = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterCategoryId && p.category_id !== filterCategoryId) return false
    if (stockFilter === 'out' && p.stock !== 0) return false
    if (stockFilter === 'low' && !(p.stock !== null && p.stock > 0 && p.stock <= STOCK_LOW)) return false
    if (stockFilter === 'in'  && !(p.stock === null || p.stock > STOCK_LOW)) return false
    return true
  })

  return (
    <>
      {/* Encabezado */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {hasActiveFilters
              ? `${filtered.length} de ${products.length} producto${products.length !== 1 ? 's' : ''}`
              : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-manglar rounded-lg hover:bg-manglar/90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo producto
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-3">

        {/* Búsqueda por nombre */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Categoría */}
        <select
          value={filterCategoryId}
          onChange={e => setFilterCategoryId(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition text-gray-700"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Stock chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STOCK_OPTS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setStockFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                stockFilter === opt.key
                  ? 'bg-manglar text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-manglar border border-manglar/30 rounded-lg hover:bg-manglar/5 transition whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-manglar rounded-full animate-spin" />
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-sm text-gray-400">
              {hasActiveFilters
                ? 'No se encontraron productos con estos filtros.'
                : 'No hay productos todavía.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-manglar hover:text-manglar/70 font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-14" />
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Producto</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Categoría</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Precio</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="pl-4 py-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{product.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.categories?.name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                      ${Number(product.price).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums ${stockColor(product.stock)}`}>
                      {product.stock ?? '∞'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(product)} className="text-xs text-gray-500 hover:text-gray-900 font-medium transition">Editar</button>
                        <button onClick={() => handleDelete(product.id)} className="text-xs text-red-500 hover:text-red-700 font-medium transition">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </>
  )
}
