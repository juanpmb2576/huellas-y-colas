import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_OPTIONS = ['pending', 'paid', 'cancelled']
const STATUS_LABELS  = { pending: 'Pendiente', paid: 'Pagado', cancelled: 'Cancelado' }
const STATUS_STYLES  = {
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  paid:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
}

const FULFILLMENT_OPTIONS = ['pending', 'shipped', 'delivered']
const FULFILLMENT_LABELS  = { pending: 'Sin enviar', shipped: 'En camino', delivered: 'Entregado' }
const FULFILLMENT_STYLES  = {
  pending:   'bg-gray-100 text-gray-500 border border-gray-200',
  shipped:   'bg-blue-50 text-blue-700 border border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const STATUS_TABS = [
  { key: null,        label: 'Todos'      },
  { key: 'paid',      label: 'Pagados'    },
  { key: 'pending',   label: 'Pendientes' },
  { key: 'cancelled', label: 'Cancelados' },
]

const DATE_PRESETS = [
  { key: 'today',     label: 'Hoy'         },
  { key: 'yesterday', label: 'Ayer'        },
  { key: 'week',      label: 'Esta semana' },
  { key: 'all',       label: 'Todas'       },
]

// ─── helpers de fecha (tiempo local del navegador) ───────────
function toLocalDateStr(d) {
  const y   = d.getFullYear()
  const m   = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getPresetRange(preset) {
  const now      = new Date()
  const todayStr = toLocalDateStr(now)
  if (preset === 'today')     return { from: todayStr, to: todayStr }
  if (preset === 'yesterday') {
    const d = new Date(now); d.setDate(d.getDate() - 1)
    const s = toLocalDateStr(d); return { from: s, to: s }
  }
  if (preset === 'week') {
    const d = new Date(now)
    const dow = d.getDay()                          // 0=dom
    d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow)) // retrocede a lunes
    return { from: toLocalDateStr(d), to: todayStr }
  }
  return { from: null, to: null }                   // 'all' o 'custom'
}

function getIndicatorText(preset, dateFrom, dateTo) {
  const CO = 'es-CO'
  const today = new Date()
  if (preset === 'today') {
    return `Pedidos de hoy — ${today.toLocaleDateString(CO, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`
  }
  if (preset === 'yesterday') {
    const d = new Date(today); d.setDate(d.getDate() - 1)
    return `Pedidos de ayer — ${d.toLocaleDateString(CO, { weekday: 'long', day: 'numeric', month: 'long' })}`
  }
  if (preset === 'week') {
    const { from } = getPresetRange('week')
    const d = new Date(from + 'T12:00:00')
    return `Pedidos de esta semana — desde el ${d.toLocaleDateString(CO, { weekday: 'long', day: 'numeric', month: 'long' })}`
  }
  if (preset === 'all') return 'Todos los pedidos'
  if (preset === 'custom') {
    if (dateFrom && dateTo) return `Pedidos del ${dateFrom} al ${dateTo}`
    if (dateFrom)           return `Pedidos desde el ${dateFrom}`
    if (dateTo)             return `Pedidos hasta el ${dateTo}`
    return 'Rango personalizado (sin fechas)'
  }
  return ''
}

// ─────────────────────────────────────────────────────────────

export default function OrdersAdminPage() {
  const [orders,               setOrders]               = useState([])
  const [loading,              setLoading]              = useState(true)
  const [updating,             setUpdating]             = useState(null)
  const [updatingFulfillment,  setUpdatingFulfillment]  = useState(null)
  const [expanded,             setExpanded]             = useState(null)
  const [filterStatus,         setFilterStatus]         = useState(null)
  const [searchQuery,          setSearchQuery]          = useState('')
  const [newOrderNotif,        setNewOrderNotif]        = useState(false)

  // Filtro de fecha: preset activo o rango personalizado
  const [datePreset, setDatePreset] = useState('today')
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Suscripción Realtime — INSERT en orders
  useEffect(() => {
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => [payload.new, ...prev])
          setNewOrderNotif(true)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handleStatusChange(id, status) {
    setUpdating(id)
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) {
      console.error('Error al actualizar estado de pago:', error)
      alert('No se pudo guardar el estado de pago. Intenta de nuevo.')
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }
    setUpdating(null)
  }

  async function handleFulfillmentChange(id, fulfillment_status) {
    setUpdatingFulfillment(id)
    const { error } = await supabase.from('orders').update({ fulfillment_status }).eq('id', id)
    if (error) {
      console.error('Error al actualizar estado de envío:', error)
      alert('No se pudo guardar el estado de envío. Intenta de nuevo.')
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, fulfillment_status } : o))
    }
    setUpdatingFulfillment(null)
  }

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  function applyPreset(key) {
    setDatePreset(key)
    setDateFrom('')
    setDateTo('')
    setExpanded(null)
  }

  function handleDateFrom(v) { setDateFrom(v); setDatePreset('custom') }
  function handleDateTo(v)   { setDateTo(v);   setDatePreset('custom') }

  function clearFilters() {
    setSearchQuery('')
    setDatePreset('today')
    setDateFrom('')
    setDateTo('')
    setFilterStatus(null)
    setExpanded(null)
  }

  // Estado "no predeterminado": cualquier cosa distinta al default (hoy, sin búsqueda, todos)
  const hasActiveFilters = searchQuery || filterStatus || datePreset !== 'today'

  // ─── Filtrado ─────────────────────────────────────────────
  function matchesDate(order) {
    if (datePreset === 'all') return true
    const { from, to } = datePreset === 'custom'
      ? { from: dateFrom || null, to: dateTo || null }
      : getPresetRange(datePreset)
    if (from && new Date(order.created_at) < new Date(from + 'T00:00:00')) return false
    if (to   && new Date(order.created_at) > new Date(to   + 'T23:59:59')) return false
    return true
  }

  // Base: fecha + búsqueda (sin estado de pago) → usada para los contadores de las tabs
  const baseFiltered = orders.filter(order => {
    if (!matchesDate(order)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!order.customer_name?.toLowerCase().includes(q) &&
          !order.customer_email?.toLowerCase().includes(q)) return false
    }
    return true
  })

  const counts = baseFiltered.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  const filtered = baseFiltered.filter(o =>
    filterStatus ? o.status === filterStatus : true
  )

  const indicatorText = getIndicatorText(datePreset, dateFrom, dateTo)

  return (
    <>
      {/* Notificación de pedido nuevo en tiempo real */}
      {newOrderNotif && (
        <div className="flex items-center gap-3 mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 font-medium">
          <span className="text-lg leading-none" aria-hidden>🎉</span>
          <span className="flex-1">¡Nuevo pedido recibido! Ya aparece arriba en la lista.</span>
          <button
            onClick={() => setNewOrderNotif(false)}
            aria-label="Cerrar notificación"
            className="text-emerald-500 hover:text-emerald-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* Encabezado */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Órdenes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filtered.length} {filtered.length === 1 ? 'pedido' : 'pedidos'}
              {hasActiveFilters && orders.length !== filtered.length
                ? ` de ${orders.length} en total`
                : ''}
            </p>
          </div>
        </div>

        {/* Indicador de contexto */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-manglar/8 border border-manglar/15">
          <svg className="w-3.5 h-3.5 text-manglar/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <span className="text-xs font-medium text-manglar/80">{indicatorText}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-5 space-y-3">

        {/* Fila 1: búsqueda + limpiar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
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

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-manglar border border-manglar/30 rounded-lg hover:bg-manglar/5 transition whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Volver a hoy
            </button>
          )}
        </div>

        {/* Fila 2: presets de fecha + rango personalizado */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Botones rápidos */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {DATE_PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  datePreset === p.key
                    ? 'bg-manglar text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Separador visual */}
          <span className="hidden sm:block w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />

          {/* Rango personalizado */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">Rango:</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={e => handleDateFrom(e.target.value)}
              className={`px-2.5 py-1.5 text-xs border rounded-lg bg-white outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition text-gray-700 ${
                datePreset === 'custom' && dateFrom ? 'border-manglar/40' : 'border-gray-200'
              }`}
            />
            <span className="text-xs text-gray-400">—</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={e => handleDateTo(e.target.value)}
              className={`px-2.5 py-1.5 text-xs border rounded-lg bg-white outline-none focus:border-manglar focus:ring-2 focus:ring-manglar/10 transition text-gray-700 ${
                datePreset === 'custom' && dateTo ? 'border-manglar/40' : 'border-gray-200'
              }`}
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); setDatePreset('today') }}
                className="text-xs text-gray-400 hover:text-gray-700 transition"
                title="Limpiar rango"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Fila 3: tabs de estado de pago */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_TABS.map(tab => {
            const count  = tab.key ? (counts[tab.key] ?? 0) : baseFiltered.length
            const active = filterStatus === tab.key
            return (
              <button
                key={String(tab.key)}
                onClick={() => { setFilterStatus(tab.key); setExpanded(null) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-manglar text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <p className="text-sm text-gray-400">
              {datePreset === 'today'
                ? 'No hay pedidos hoy todavía.'
                : datePreset === 'yesterday'
                ? 'No hubo pedidos ayer.'
                : 'No se encontraron pedidos con estos filtros.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-manglar hover:text-manglar/70 font-medium transition-colors"
              >
                Ver pedidos de hoy
              </button>
            )}
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Productos</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Pago</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Envío</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => {
                  const items      = Array.isArray(order.items) ? order.items : []
                  const totalUnits = items.reduce((sum, i) => sum + (i.quantity ?? 0), 0)
                  const isExpanded = expanded === order.id
                  const fulfillment = order.fulfillment_status ?? 'pending'
                  const isPaid      = order.status === 'paid'

                  return (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {/* Fecha */}
                        <td className="px-6 py-4 whitespace-nowrap align-top">
                          <p className="text-xs text-gray-700">
                            {new Date(order.created_at).toLocaleDateString('es-CO', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.created_at).toLocaleTimeString('es-CO', {
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </td>

                        {/* Cliente */}
                        <td className="px-6 py-4 align-top">
                          <p className="font-medium text-gray-900">
                            {order.customer_name ?? <span className="text-gray-300 font-normal">—</span>}
                          </p>
                          <div className="mt-0.5 space-y-0.5 text-xs text-gray-500">
                            {order.customer_email && <p>{order.customer_email}</p>}
                            {order.customer_phone && <p>{order.customer_phone}</p>}
                            {order.shipping_address && (
                              <p className="text-gray-400 max-w-[180px] leading-snug">{order.shipping_address}</p>
                            )}
                          </div>
                        </td>

                        {/* Productos */}
                        <td className="px-6 py-4 align-top">
                          {items.length === 0 ? (
                            <span className="text-gray-300 text-xs">—</span>
                          ) : (
                            <div className="space-y-1">
                              {items.slice(0, isExpanded ? items.length : 2).map((item, idx) => (
                                <div key={idx} className="flex items-baseline gap-2 text-xs">
                                  <span className="text-gray-700 font-medium">{item.name}</span>
                                  <span className="text-gray-400">×{item.quantity}</span>
                                  <span className="text-gray-500 ml-auto whitespace-nowrap">
                                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                                  </span>
                                </div>
                              ))}
                              {!isExpanded && items.length > 2 && (
                                <p className="text-xs text-manglar/70 font-medium">
                                  +{items.length - 2} más — ver detalle
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400 pt-0.5">
                                {items.length} {items.length === 1 ? 'producto' : 'productos'} · {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}
                              </p>
                            </div>
                          )}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 text-right font-medium text-gray-900 whitespace-nowrap align-top">
                          ${Number(order.total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Estado de pago */}
                        <td className="px-6 py-4 text-center align-top" onClick={e => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full outline-none cursor-pointer transition-opacity ${STATUS_STYLES[order.status]} ${updating === order.id ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        </td>

                        {/* Estado de envío */}
                        <td className="px-6 py-4 text-center align-top" onClick={e => e.stopPropagation()}>
                          {isPaid ? (
                            <select
                              value={fulfillment}
                              onChange={e => handleFulfillmentChange(order.id, e.target.value)}
                              disabled={updatingFulfillment === order.id}
                              className={`text-xs font-medium px-3 py-1.5 rounded-full outline-none cursor-pointer transition-opacity ${FULFILLMENT_STYLES[fulfillment]} ${updatingFulfillment === order.id ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                            >
                              {FULFILLMENT_OPTIONS.map(s => (
                                <option key={s} value={s}>{FULFILLMENT_LABELS[s]}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Fila expandida */}
                      {isExpanded && items.length > 0 && (
                        <tr key={`${order.id}-detail`} className="bg-manglar/[0.03]">
                          <td colSpan={6} className="px-6 py-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Detalle completo del pedido</p>
                            <div className="space-y-2">
                              {items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
                                  )}
                                  <span className="text-sm text-gray-800 flex-1">{item.name}</span>
                                  <span className="text-xs text-gray-500">×{item.quantity}</span>
                                  <span className="text-xs text-gray-500 w-20 text-right">
                                    ${Number(item.price).toLocaleString('es-CO')} c/u
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 w-24 text-right">
                                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                              <p className="text-sm font-semibold text-gray-900">
                                Total: ${Number(order.total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
