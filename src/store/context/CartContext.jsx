import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('petshop-cart') ?? '[]')
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('petshop-cart', JSON.stringify(items))
  }, [items])

  function addItem(product) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      // null = sin límite de stock conocido
      const stock = product.stock ?? null

      if (existing) {
        // Si ya llegó al máximo de stock, no incrementar
        if (stock !== null && existing.quantity >= stock) return prev
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1, stock }
            : i
        )
      }

      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url ?? null,
        stock,
        quantity: 1,
      }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateQuantity(id, delta) {
    setItems(prev =>
      prev
        .map(i => {
          if (i.id !== id) return i
          const newQty = i.quantity + delta
          if (newQty <= 0) return { ...i, quantity: 0 }
          // Respetar stock al incrementar
          if (delta > 0 && i.stock !== null && newQty > i.stock) return i
          return { ...i, quantity: newQty }
        })
        .filter(i => i.quantity > 0)
    )
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      total,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
