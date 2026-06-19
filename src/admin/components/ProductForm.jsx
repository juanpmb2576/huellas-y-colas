import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

// Comprime una imagen en el navegador usando Canvas.
// Redimensiona a maxWidth px, exporta como WebP (o JPEG como fallback),
// apuntando a calidad 0.85. Sin dependencias externas.
async function compressImage(file, { maxWidth = 1200, quality = 0.85 } = {}) {
  const img = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = URL.createObjectURL(file)
  })

  let w = img.naturalWidth
  let h = img.naturalHeight
  if (w > maxWidth) {
    h = Math.round(h * maxWidth / w)
    w = maxWidth
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)

  // Detectar soporte real de WebP: algunos navegadores aceptan el tipo
  // pero devuelven PNG — verificamos los primeros bytes del data URL.
  const probe = canvas.toDataURL('image/webp')
  const supportsWebP = probe.startsWith('data:image/webp')
  const mimeType = supportsWebP ? 'image/webp' : 'image/jpeg'
  const ext     = supportsWebP ? 'webp' : 'jpg'

  const blob = await new Promise(resolve =>
    canvas.toBlob(resolve, mimeType, quality)
  )

  return { blob, ext, mimeType, width: w, height: h }
}

function formatKB(bytes) {
  const kb = bytes / 1024
  return kb >= 1024
    ? `${(kb / 1024).toFixed(1)} MB`
    : `${Math.round(kb)} KB`
}

export default function ProductForm({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    category_id: '',
    active: true,
  })
  const [imageFile, setImageFile]   = useState(null)   // Blob comprimido listo para subir
  const [imageExt, setImageExt]     = useState('webp') // Extensión resultante
  const [imageMime, setImageMime]   = useState('image/webp')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageInfo, setImageInfo]   = useState(null)   // Stats de compresión para la UI
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        price: String(product.price),
        stock: String(product.stock),
        category_id: product.category_id ?? '',
        active: product.active,
      })
      setImagePreview(product.image_url ?? null)
    } else {
      setForm({ name: '', description: '', price: '', stock: '0', category_id: '', active: true })
      setImagePreview(null)
    }
    setImageFile(null)
    setImageInfo(null)
    setError('')
  }, [product])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // Mostrar preview del original inmediatamente
    setImagePreview(URL.createObjectURL(file))
    setImageInfo({ compressing: true, originalSize: file.size })

    try {
      const { blob, ext, mimeType, width, height } = await compressImage(file)
      setImageFile(blob)
      setImageExt(ext)
      setImageMime(mimeType)
      setImagePreview(URL.createObjectURL(blob))
      setImageInfo({
        compressing: false,
        originalName: file.name,
        originalSize: file.size,
        compressedSize: blob.size,
        format: ext.toUpperCase(),
        width,
        height,
      })
    } catch {
      // Fallback: subir el original sin comprimir
      setImageFile(file)
      setImageExt(file.name.split('.').pop().toLowerCase())
      setImageMime(file.type)
      setImageInfo(null)
    }
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImageExt('webp')
    setImageMime('image/webp')
    setImagePreview(null)
    setImageInfo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!form.price || isNaN(parseFloat(form.price))) { setError('El precio es obligatorio.'); return }

    setSaving(true)
    setError('')

    try {
      let image_url

      if (imageFile) {
        const path = `${Date.now()}.${imageExt}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, imageFile, { contentType: imageMime })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
        image_url = urlData.publicUrl
      } else {
        image_url = imagePreview ?? null
      }

      const payload = {
        name:        form.name.trim(),
        description: form.description.trim() || null,
        price:       parseFloat(form.price),
        stock:       parseInt(form.stock) || 0,
        category_id: form.category_id || null,
        active:      form.active,
        image_url,
      }

      let dbError
      if (product?.id) {
        ;({ error: dbError } = await supabase.from('products').update(payload).eq('id', product.id))
      } else {
        ;({ error: dbError } = await supabase.from('products').insert(payload))
      }
      if (dbError) throw dbError

      onSave()
    } catch {
      setError('No se pudo guardar el producto. Verificá los datos e intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Nombre <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition"
          placeholder="Ej. Royal Canin Adult 15kg"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition resize-none"
          placeholder="Descripción del producto..."
        />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Precio <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              className="w-full pl-7 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={e => set('stock', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition"
            placeholder="0"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={form.category_id}
          onChange={e => set('category_id', e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition bg-white"
        >
          <option value="">Sin categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Imagen</label>

        {imagePreview ? (
          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
            <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              {imageInfo?.compressing ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin shrink-0" />
                  Comprimiendo imagen…
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {imageInfo?.originalName ?? 'Imagen actual'}
                  </p>
                  {imageInfo && (
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-gray-400 line-through">
                        {formatKB(imageInfo.originalSize)}
                      </span>
                      <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="text-xs font-semibold text-emerald-600">
                        {formatKB(imageInfo.compressedSize)}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 font-semibold rounded uppercase">
                        {imageInfo.format}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {imageInfo.width}×{imageInfo.height}px
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageInfo?.compressing}
                  className="text-xs text-gray-500 hover:text-gray-900 font-medium transition disabled:opacity-40"
                >
                  Cambiar
                </button>
                <span className="text-gray-300">·</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                >
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-sm text-gray-400">Seleccioná una imagen</span>
            <span className="text-xs text-gray-300">PNG, JPG, WEBP — se comprime automáticamente</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
        <div>
          <p className="text-sm font-medium text-gray-700">Producto activo</p>
          <p className="text-xs text-gray-400 mt-0.5">Los inactivos no se muestran en la tienda</p>
        </div>
        <button
          type="button"
          onClick={() => set('active', !form.active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.active ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              form.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || imageInfo?.compressing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {saving ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </div>
  )
}
