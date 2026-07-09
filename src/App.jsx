import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './landing/LandingPage'

import StoreLayout from './store/components/StoreLayout'
import HomePage from './store/pages/HomePage'
import CheckoutPage from './store/pages/CheckoutPage'
import OrderSuccessPage from './store/pages/OrderSuccessPage'
import ProductsPage from './store/pages/ProductsPage'
import ProductDetailPage from './store/pages/ProductDetailPage'
import CartPage from './store/pages/CartPage'
import OrderTrackingPage from './store/pages/OrderTrackingPage'

import LoginPage from './admin/pages/LoginPage'
import CategoriesPage from './admin/pages/CategoriesPage'
import ProductsAdminPage from './admin/pages/ProductsAdminPage'
import OrdersAdminPage from './admin/pages/OrdersAdminPage'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLayout from './admin/components/AdminLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing institucional */}
        <Route path="/" element={<LandingPage />} />

        {/* Tienda pública — prefijo /petshop */}
        <Route path="/petshop" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="order/:id" element={<OrderTrackingPage />} />
        </Route>

        {/* Admin - public */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin - protected */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
          </Route>
        </Route>

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
