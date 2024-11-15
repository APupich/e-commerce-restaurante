import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Product() {
  const { id_producto } = useParams(); // Captura el parámetro de la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1); // Estado para la cantidad

  useEffect(() => {
    // Función para obtener el detalle del producto
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/plato/${id_producto}`);
        const data = await response.json();
        console.log(data);
        setProducto(data[0]); // Guarda los datos del producto en el estado
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        setLoading(false);
      }
    };

    fetchProducto(); // Llama a la función cuando el componente se monta
  }, [id_producto]);

  const handlePedido = async () => {
    const id_usuario = localStorage.getItem('user_id'); // Obtén el ID del usuario desde el localStorage

    if (!id_usuario) {
      alert("Debes iniciar sesión para hacer un pedido.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/pedido/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_producto,
          id_usuario,
          cantidad,
        }),
      });

      if (response.ok) {
        alert("Pedido realizado con éxito.");
      } else {
        alert("Hubo un error al realizar el pedido.");
      }
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Hubo un error al realizar el pedido.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div>
      <h2>{producto.nombre}</h2>
      <img src={producto.foto_Url} alt={producto.nombre} />
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precio}</p>
      
      {/* Formulario de cantidad */}
      <div>
        <label>
          Cantidad:
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, e.target.value))}
            min="1"
          />
        </label>
        <button onClick={handlePedido}>Hacer Pedido</button>
      </div>
    </div>
  );
}

export default Product;
