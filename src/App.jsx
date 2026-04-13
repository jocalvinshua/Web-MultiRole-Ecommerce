import { Route, Routes, useLocation, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useContext } from "react"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

import Home from "./pages/client/Home"
import Products from "./pages/client/Products"
import ProductCategory from "./pages/client/ProductCategory"
import ProductDetails from "./pages/client/ProductDetails"
import Cart from "./pages/client/Cart"
import AddAddress from "./pages/client/AddAddress"
import MyOrders from "./pages/client/MyOrders"

import SellerLayout from "./pages/Seller/SellerLayout"
import AddProduct from "./pages/Seller/AddProduct"
import ProductList from "./pages/Seller/ProductList"
import Orders from "./pages/Seller/Orders"
import SellerLogin from "./features/auth/SellerLogin"
import Login from "./features/auth/Login"

import { useAppContext } from "./context/AppContext"
import { AuthContext, useAuth } from "./context/AuthContext"

const App = () => {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith("/admin")

  const { showLogin } = useAuth()
  const { isAdmin, authLoading } = useContext(AuthContext)

  // ⏳ Tunggu auth selesai
  if (authLoading) return null

  return (
    <div className="min-h-screen text-gray-700 bg-white">
      <Toaster position="top-center" />
      {showLogin && <Login />}

      {/* ===== CLIENT LAYOUT ===== */}
      {!isAdminPage && <Navbar />}

      <div className="px-4 md:px-16 xl:px-24">
        <Routes>
          {/* ===== CLIENT ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* ===== ADMIN LOGIN ===== */}
          <Route
            path="/admin"
            element={isAdmin ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* ===== PROTECT CHILD ADMIN ROUTES ===== */}
          <Route
            path="/admin/*"
            element={
              isAdmin ? <SellerLayout /> : <Navigate to="/admin" replace />
            }
          />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  )
}

export default App
