import { Outlet } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { ToastProvider } from '../context/ToastContext'
import Header from './Header'
import CartDrawer from './CartDrawer'

export default function StoreLayout() {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="min-h-screen bg-lino font-body">
          <Header />
          <CartDrawer />
          <main>
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </CartProvider>
  )
}
