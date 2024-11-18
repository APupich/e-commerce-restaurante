import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css'; // Importamos el archivo CSS modular

export default function Cart() {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Estado para procesar la compra
  const [purchaseSuccess, setPurchaseSuccess] = useState(false); // Estado para indicar si la compra fue exitosa
  const [orderId, setOrderId] = useState(null); // Estado para almacenar el ID del pedido

  const id_usuario = localStorage.getItem("user_id");

  useEffect(() => {
    if (!id_usuario) {
      setLoading(false);
      setLoginError('Debes iniciar sesión para ver tu carrito.');
      return;
    }

    const fetchCarrito = async () => {
      try {
        const response = await fetch(`http://localhost:3000/carrito/${id_usuario}`);
        if (!response.ok) {
          throw new Error('Error al cargar el carrito');
        }
        const data = await response.json();
        setCarrito(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, [id_usuario]);

  if (loginError) return (
    <div className={styles.main}>
      <h2>Debes iniciar sesion para ver tu carrito.</h2>
    </div>
  );
  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>{error}</p>;
  if (carrito.length === 0) return (
    <div className={styles.main}>
      <h2>Tu carrito está vacío.</h2>
    </div>
  );

  // Función para eliminar un item del carrito
  const eliminarItem = async (id_detalle) => {
    try {
      const response = await fetch(`http://localhost:3000/carrito/eliminar/${id_detalle}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Error al eliminar el item');
      }
      // Elimina el item del estado después de la solicitud exitosa
      setCarrito(prevCarrito => prevCarrito.filter(item => item.ID_detalle !== id_detalle));
    } catch (error) {
      setError(error.message);
    }
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = async (id_detalle, cantidad) => {
    if (cantidad > 5) {
      // Limita la cantidad máxima a 5
      cantidad = 5;
    }

    try {
      const response = await fetch(`http://localhost:3000/carrito/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_detalle, cantidad })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la cantidad');
      }
      // Actualiza el carrito con la nueva cantidad y recalcula el total del producto
      setCarrito(prevCarrito =>
        prevCarrito.map(item =>
          item.ID_detalle === id_detalle
            ? { ...item, cantidad, total_item: item.precio_plato * cantidad }
            : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Función para hacer la compra
  const hacerCompra = async () => {
    if (carrito.length === 0) return;

    // Supongamos que el id_pedido está en el primer item del carrito
    const id_pedido = carrito[0].id_pedido;

    // Iniciar el estado de procesamiento
    setIsProcessing(true);

    try {
      const response = await fetch(`http://localhost:3000/comprar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pedido })
      });

      if (!response.ok) {
        throw new Error('Error al realizar la compra');
      }

      // Marcar la compra como exitosa y actualizar el estado
      setPurchaseSuccess(true);
      setOrderId(id_pedido); // Guardamos el id_pedido

      // Aquí puedes redirigir a otra página o limpiar el carrito
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false); // Detener el estado de carga
    }
  };

  return (
    <div className={styles.mainea+" "+styles['cart-container']}>
      {isProcessing ? (
        <div className={styles['loading']}>
          <p>Procesando la compra...</p>
        </div>
      ) : purchaseSuccess ? (
        <div className={styles['purchase-success']}>
          <h2>¡Compra realizada con éxito!</h2>
          <p>Tu ID de pedido es: <strong>{orderId}</strong></p>
          <p>Gracias por tu compra.</p>
        </div>
      ) : (
        <>
          <h2>Carrito de Compras</h2><br />
          <div className={styles['cart-items']}>
            {carrito.map(item => (
              <div key={item.ID_detalle} className={styles['cart-item']}>
                <img src={item.foto_Url} alt={item.nombre_plato} />
                <div className={styles['item-info']}>
                  <h3>{item.nombre_plato}</h3>
                  <p>Precio: ${item.precio_plato}</p>
                  <p>Total: ${item.total_item.toFixed(2)}</p>
                </div>
                <div className={styles['item-actions']}>
                  <i className={`${styles.red} fa-solid fa-trash`} onClick={() => eliminarItem(item.ID_detalle)}></i>
                  <div className={styles.flex}>
                    <button
                      onClick={() => {
                        if (item.cantidad > 1) {
                          actualizarCantidad(item.ID_detalle, item.cantidad - 1);
                        }
                      }}
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <p>{item.cantidad}</p>
                    <button
                      onClick={() => {
                        if (item.cantidad < 5) {
                          actualizarCantidad(item.ID_detalle, item.cantidad + 1);
                        }
                      }}
                      disabled={item.cantidad >= 5}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles['cart-summary']}>
            <p>
              <strong>
                Total: ${carrito.reduce((acc, item) => acc + item.total_item, 0).toFixed(2)}
              </strong>
            </p>
            <button onClick={hacerCompra}>Hacer compra</button>
          </div>
        </>
      )}
    </div>
  );
}
