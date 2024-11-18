import React, { useState, useEffect } from "react";
import s from "./Pedidos.module.css";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDetalles, setModalDetalles] = useState(null); // Manejar modal

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const date = getCurrentDate();
        const response = await fetch(`http://localhost:3000/pedido/${date}`);
        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }
        const data = await response.json();
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const completarPedido = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/pedido/completar/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error al marcar el pedido como completado");
      }
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.ID_pedido === id ? { ...pedido, estado_pedido: "Completado" } : pedido
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const revertirPedido = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/pedido/revertir/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error al revertir el pedido a 'En proceso'");
      }
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.ID_pedido === id ? { ...pedido, estado_pedido: "En proceso" } : pedido
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const abrirDetalles = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/pedido/detalle/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del pedido");
      }
      const data = await response.json();
      setModalDetalles({ id, detalles: data });
    } catch (err) {
      setError(err.message);
    }
  };

  const cerrarModal = () => {
    setModalDetalles(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (pedidos.length === 0) {
    return <div className={s.maineado}>No hay pedidos para hoy.</div>;
  }

  return (
    <div className={s.main}>
      <h2>Pedidos de {getCurrentDate()}</h2>
      <div className={s.container}>
        {pedidos.map((pedido) => {
          const isCompleted = pedido.estado_pedido === "Completado";
          return (
            <section
              key={pedido.ID_pedido}
              className={
                isCompleted
                  ? `${s.card} ${s.bg_completado}`
                  : `${s.card} ${s.bg_pendiente}`
              }
              onClick={() => abrirDetalles(pedido.ID_pedido)} // Clic en tarjeta abre detalles
            >
              <div>
                <p><b>Pedido #{pedido.ID_pedido}</b></p>
                <p>Cliente: {pedido.name}</p>
                <p>Cant. Productos: {pedido.total_platillos}</p>
                <p>Total: ${pedido.total_pedido.toFixed(2)}</p>
                <p>Estado: {pedido.estado_pedido}</p>
                <p>Fecha: {pedido.fecha_pedido.split("T")[1].split(".")[0]}</p>
              </div>
              <button
                className={s.icon}
                onClick={(e) => {
                  e.stopPropagation();
                  isCompleted
                    ? revertirPedido(pedido.ID_pedido)
                    : completarPedido(pedido.ID_pedido);
                }}
              >
                <i
                  className={
                    s.icon +
                    (isCompleted
                      ? ` ${s.red} fa-solid fa-circle-xmark`
                      : " fa-solid fa-circle-check")
                  }
                ></i>
              </button>
            </section>
          );
        })}
      </div>

      {/* Modal para los detalles del pedido */}
      {modalDetalles && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <button className={s.closeButton} onClick={cerrarModal}>
              &times;
            </button>
            <h4>Detalles del Pedido #{modalDetalles.id}</h4>
            <ul>
              {modalDetalles.detalles.map((detalle, index) => (
                <li key={index}>
                  {detalle.ID_plato} - {detalle.nombre_plato} - ${detalle.precio} x{" "}
                  {detalle.cantidad}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
