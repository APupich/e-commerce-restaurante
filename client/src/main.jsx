import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'

import MainLayout from './layouts/MainLayout/MainLayout.jsx'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import Products from './pages/Products/Products.jsx'
import Product from './pages/Product/Product.jsx'

import Cart from './pages/Cart/Cart.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout/>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/productos" element={<Products/>}/>
        <Route path="/producto/:id_producto" element={<Product/>}/>
        <Route path="/carrito" element={<Cart/>}/>
      </Route>
    </Routes>
  </BrowserRouter>  
)
