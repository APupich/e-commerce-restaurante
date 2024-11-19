import React, { useState, useEffect } from 'react';
import s from "./filter.module.css";

export default function Filter({ onCategorySelect, admin = false}) {
  const ENDPOINTS = {
    FILTROS: "http://localhost:3000/categorias"
  };

  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategorySubmit = (nuevaCategoria) => {
    fetch("http://localhost:3000/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaCategoria),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFilterData([...filterData, nuevaCategoria]);
          console.log(filterData)
          setIsModalOpen(false);
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error al añadir categoría:", error);
        alert("Ocurrió un error al añadir la categoría.");
      });
  };

  return (
    <div className={s.filterContainer}>
      {admin &&( 
        <div
          className={`${s.elem} ${s.addCategory}`}
          onClick={handleAddCategoryClick}
        >
          <div className={s.imgContainer}>
            <i className="fa-solid fa-plus"></i>
          </div>
          <span>Añadir Categoría</span>
        </div>
      )}
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
      
      {isModalOpen && (
        <AddCategoryModal onClose={handleModalClose} onSubmit={handleCategorySubmit} />
      )}
    </div>
  );

  function AddCategoryModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
      nombre: "",
      imgUrl: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.nombre || !formData.imgUrl) {
        alert("Por favor, completa todos los campos.");
        return;
      }
      const nuevaCategoria = { 
        categoria: formData.nombre,
        img: formData.imgUrl,
        content: formData.nombre,
      };
      onSubmit(nuevaCategoria); // Enviar nueva categoría a la función de manejo
      onClose(); // Cerrar el modal
    };

    return (
      <div className={s.modalOverlay}>
        <div className={s.modal}>
          <button className={s.closeButton} onClick={onClose}>
            &times;
          </button>
          <h2>Añadir Nueva Categoría</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              URL de la imagen:
              <input
                type="text"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit" className={s.submitButton}>
              Guardar
            </button>
            <button type="button" className={s.cancelButton} onClick={onClose}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    );
  }
}
