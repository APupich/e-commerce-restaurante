import React ,{ useState,useEffect } from 'react'
import { Link } from "react-router-dom"
import s from "./Products.module.css"


export default function Products() {
  const ENDPOINTS = {
    FILTROS:"/filtros/filters.json"
  }
  const [filterData,setFilterData] = useState([]);

  useEffect(() => {
    fetch(ENDPOINTS.FILTROS)
      .then((response) => response.json())
      .then((d) => setFilterData(d))
      .catch((error) => console.error('Error fetching data:', error));
  }, [ENDPOINTS.FILTROS]);
  
  return (
    <>
      <div className={s.filter}>
        <div className={s.rutas}>
          <Link to="/">Inicio</Link>
          <i class="fa-solid fa-chevron-right"></i>
          <span>Productos</span>
        </div>
        <div className={s.productos}>
          <h1>Nuestros Productos</h1>
          <div className={s.filterContainer}>
            {filterData.map((e) => (
              <div className={s.elem+" "+s.selected}>
                <img src={e.img}/>
                <span>{e.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </>
  )
}
