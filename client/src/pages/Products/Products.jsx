import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import s from "./Products.module.css";
import Filter from "../../components/Filter/Filter";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [categoryName, setCategoryName] = useState("Hamburguesas");

  const fetchProductsByCategory = (categoryId) => {
    setLoading(true);
    fetch(`http://localhost:3000/menu/${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProductsByCategory(categoryId);
  }, [categoryId]);

  const handlersCategorySelect = (categoryId,categoryName) => {
    setCategoryId(categoryId);
    setCategoryName(categoryName);
  };

  
  return (
    <div className={s.filter}>
      <div className={s.rutas}>
        <Link to="/">Inicio</Link>
        <i className="fa-solid fa-chevron-right"></i>
        <span>Productos</span>
      </div>
      <div className={s.productos}>
        <h1>Nuestros Productos</h1>
        <Filter onCategorySelect={handlersCategorySelect}/>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <>
            <h1>{categoryName}</h1>
            <div className={s.productList}>
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.ID_plato} className={s.productItem}>
                    <div className={s.imgContainer}><img src={product.foto_Url} alt={product.nombre}/></div>
                    <span>{product.nombre}</span>
                  </div>
                ))
              ) : (
                <p>No se encontraron productos.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
