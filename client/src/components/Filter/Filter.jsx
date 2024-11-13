import React, { useState, useEffect } from 'react';
import s from "./filter.module.css";

export default function Filter({ onCategorySelect }) {
  const ENDPOINTS = {
    FILTROS: "/filtros/filters.json"
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
          onCategorySelect(data[0].categoria);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleFilterClick = (index, category) => {
    setSelectedItem(index);
    onCategorySelect(category);
  };

  return (
    <div className={s.filterContainer}>
      {filterData.map((e, indexElem) => (
        <div
          key={indexElem}
          className={`${s.elem} ${selectedItem === indexElem ? s.selected : ''}`}
          onClick={() => handleFilterClick(indexElem, e.categoria)}
        >
          <div className={s.imgContainer}>
            <img src={e.img} alt={e.content} />
          </div>
          <span>{e.content}</span>
        </div>
      ))}
    </div>
  );
}
