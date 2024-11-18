import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'

import MainLayout from './layouts/MainLayout/MainLayout.jsx'
import ProductLayout from './layouts/ProductLayout/ProductLayout.jsx'

import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import Products from './pages/Products/Products.jsx'
import Product from './pages/Product/Product.jsx'

import Cart from './pages/Cart/Cart.jsx'

import Panel from './pages/Admin/Panel.jsx'
import Pedidos from './pages/Admin/Pedidos/Pedidos.jsx'
import Empleados from './pages/Admin/Empleados/Empleados.jsx'
import Stats from './pages/Admin/Stats/Stats.jsx'
import Productos from './pages/Admin/Productos/Productos.jsx'

const isAdmin = localStorage.getItem("admin")
const isEmployee = localStorage.getItem("employee")

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout/>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/productos" element={<Products/>}/>
        
        <Route path="/carrito" element={<Cart/>}/>
      </Route>
      <Route path="/producto/" element={<ProductLayout/>}>
        <Route path=":id_producto" element={<Product/>}/>
      </Route>
      <Route path="/admin" element={isAdmin || isEmployee ? <MainLayout /> : <Navigate to="/" />}>
        <Route path="" element={<Panel />} />
        <Route path="panel" element={<Panel />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="empleados" element={isAdmin ? <Empleados /> : <Navigate to="/" />} />
        <Route path="stats" element={<Stats />} />
        <Route path="productos" element={<Productos />} />

      </Route>
    </Routes>
  </BrowserRouter>  
)
