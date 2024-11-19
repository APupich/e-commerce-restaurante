import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import s from "./Productos.module.css";
import Filter from "../../../components/Filter/Filter";

export default function Productos() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryId, setCategoryId] = useState(1);
    const [categoryName, setCategoryName] = useState("Hamburguesas");
    const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para editar
    const [isModalOpen, setIsModalOpen] = useState(false); // Control del popup
    const [ModalOpen, setModal] = useState(false); // Control del popup

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

    const handleCategorySelect = (categoryId, categoryName) => {
        setCategoryId(categoryId);
        setCategoryName(categoryName);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleModalClose2 = () => {
        setModal(false);
    };
    const handleProductUpdate = (updatedProduct) => {
        console.log(updatedProduct)
        fetch(`http://localhost:3000/menu/update/${updatedProduct.ID_plato}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Producto actualizado correctamente");
                    fetchProductsByCategory(categoryId); // Refrescar los productos
                } else {
                    setError(data.message)
                }
            })
            .catch((error) => console.error("Error updating product:", error))
            .finally(() => handleModalClose());
    };
    const handleProductInsert = (updatedProduct) => {
        console.log(updatedProduct)
        fetch(`http://localhost:3000/menu/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Producto agregado correctamente");
                    fetchProductsByCategory(categoryId); // Refrescar los productos
                } else {
                    setError(data.message)
                }
            })
            .catch((error) => console.error("Error updating product:", error))
            .finally(() => handleModalClose2());
    };
    return (
        <div className={s.filter}>
            <div className={s.productos}>
                <h1>Editor de Productos</h1>
                <Filter onCategorySelect={handleCategorySelect} admin={true} />

                {loading ? (
                    <p>Cargando productos...</p>
                ) : (

                    <div className={s.productList}>
                        <h1 className={s.h1}>{categoryName}</h1>

                        {products.length > 0 ? (
                            <>
                                <div className={s.productItem + " " + s.addCategory} onClick={setModal}>
                                    <div className={s.imgContainer2}>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                    <span>Nuevo</span>
                                </div>
                                {products.map((product) => (
                                    <div
                                        key={product.ID_plato}
                                        className={s.productItem}
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className={s.imgContainer}>
                                            <img src={product.foto_Url} alt={product.nombre} />
                                        </div>
                                        <span>{product.nombre}</span>
                                    </div>
                                ))}
                            </>) : (
                            <>
                                <div className={s.productItem + " " + s.addCategory}>
                                    <div className={s.imgContainer2}>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                    <span>Nuevo</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    product={selectedProduct}
                    onClose={handleModalClose}
                    onSave={handleProductUpdate}
                />
            )}
            {ModalOpen && (
                <Modal2
                    category={categoryId}
                    onClose={handleModalClose2}
                    onSave={handleProductInsert}
                />
            )}
        </div>
    );
}

function Modal({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        nombre: product.nombre,
        foto_Url: product.foto_Url,
        precio: product.precio,
        descripcion: product.descripcion,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = { ...product, ...formData };
        onSave(updatedProduct);
    };

    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <button className={s.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2>Editar Producto</h2>
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
                            name="foto_Url"
                            value={formData.foto_Url}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Precio:
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Guardar</button>
                    <button
                        type="button"
                        className={s.close}
                        onClick={onClose} // Cierra el modal sin enviar
                    >
                        Cerrar
                    </button>
                </form>
            </div>
        </div>
    );
}

function Modal2({ category, onClose, onSave }) {
    const [formData, setFormData] = useState({
        category: category,
        nombre: "Nombre producto",
        foto_Url: "Foto Producto",
        precio: 9.99,
        descripcion: "Descripcion Producto",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = formData;
        onSave(updatedProduct);
    };

    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <button className={s.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2>Nuevo Producto</h2>
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
                            name="foto_Url"
                            value={formData.foto_Url}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Precio:
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Guardar</button>
                    <button
                        type="button"
                        className={s.close}
                        onClick={onClose} // Cierra el modal sin enviar
                    >
                        Cerrar
                    </button>
                </form>
            </div>
        </div>
    );
}
