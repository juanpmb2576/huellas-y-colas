import { Outlet } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import Header from './Header'
import CartDrawer from './CartDrawer'

export default function StoreLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-lino">
        <Header />
        <CartDrawer />
        <main>
          <Outlet />
        </main>
      </div>
    </CartProvider>
  )
}
