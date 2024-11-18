import React, { useState, useEffect } from 'react';
import s from "./filter.module.css";

export default function Filter({ onCategorySelect }) {
  const ENDPOINTS = {
    FILTROS: "http://localhost:3000/categorias"
  };

  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 

  useEffect(() => {
    fetch(ENDPOINTS.FILTROS)
      .then((response) => response.json())
      .then((data) => {
        setFilterData(data);
        if (selectedItem === null) {
          setSelectedItem(0);
          onCategorySelect(data[0].categoria, data[0].content);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
    onCategorySelect(1, "Hamburguesas");
  }, []);

  const handleFilterClick = (index, categoryId, categoryName) => {
    setSelectedItem(index);
    onCategorySelect(categoryId, categoryName);
  };
  const handleAddCategoryClick = () => {
    // Aquí puedes implementar la lógica para añadir una categoría
    alert("Añadir nueva categoría");
  };
  return (
    <div className={s.filterContainer}>
      {filterData.map((e, indexElem) => (
        <div
          key={indexElem}
          className={`${s.elem} ${selectedItem === indexElem ? s.selected : ''}`}
          onClick={() => handleFilterClick(indexElem, e.categoria, e.content)}
        >
          <div className={s.imgContainer}>
            <img src={e.img} alt={e.content} />
          </div>
          <span>{e.content}</span>
        </div>
      ))}
      <div
        className={`${s.elem} ${s.addCategory}`}
        onClick={handleAddCategoryClick}
      >
        <div className={s.imgContainer}>
          <i className="fa-solid fa-plus"></i>
        </div>
        <span>Añadir Categoría</span>
      </div>
    </div>

  );
}
