import React, { useState, useEffect } from 'react';
import s from "./Empleados.module.css";

export default function Empleados() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModal2, setMostrarModal2] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agregarError, setAgregarError] = useState("");


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState(2);  // 1 = admin, 2 = empleado, 0 = cliente
    // Función para agregar un nuevo usuario
    const agregarUsuario = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuarios/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, admin: rol }),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el usuario');
            }

            const data = await response.json();
            if (data.error) {
                setAgregarError(data.error);
            }
            alert(data.message); // Muestra el mensaje de éxito o error
            setMostrarModal2(false); // Cierra el modal
            setEmail('');
            setPassword('');
            setRol(2); // Restablecer el rol a "Empleado" por defecto

            // Actualiza la lista de empleados
            const nuevosEmpleados = await fetch('http://localhost:3000/usuarios');
            const empleadosData = await nuevosEmpleados.json();
            setEmpleados(empleadosData);
        } catch (err) {
            setError(err.message);
        }
    };
    useEffect(() => {
        const isEmployee = localStorage.getItem("employee"); // Se espera un valor tipo string ("true" o "false")
        const isAdmin = localStorage.getItem("admin"); // Se espera un valor tipo string ("true" o "false")

        console.log(isAdmin); // Verifica los valores de isAdmin e isEmployee
        console.log(isEmployee);

        if (isEmployee === "true" && isAdmin !== "true") {
            setMostrarModal(true);  // Mostrar el modal de acceso restringido

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = "/admin";
            }, 2000); // 2 segundos
        }
    }, []);
    useEffect(() => {
        const isEmployee = localStorage.getItem("employee");
        const isAdmin = localStorage.getItem("admin");
        console.log(isAdmin)
        console.log(isEmployee)
        if (!isAdmin) {
            if (isEmployee) {
                setMostrarModal(true);  // Mostrar el modal de acceso restringido

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 2000); // 2 segundos
            }
        }

        // Obtener los empleados y admins
        const fetchEmpleados = async () => {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error al obtener los empleados');
                }
                const data = await response.json();
                setEmpleados(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleados();
    }, []);

    // Función para actualizar el rol de un empleado
    const actualizarRol = async (id, nuevoRol) => {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/actualizar/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ admin: nuevoRol }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el rol');
            }

            // Actualiza el estado en el frontend
            setEmpleados((prevEmpleados) =>
                prevEmpleados.map((empleado) =>
                    empleado.ID_usuario === id ? { ...empleado, admin: nuevoRol } : empleado
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // Si se está cargando
    if (loading) {
        return <div>Loading...</div>;
    }

    // Si hay error
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Si no hay empleados
    if (empleados.length === 0) {
        return <div>No hay empleados o admins registrados.</div>;
    }

    return (
        <div className={s.main}>
            <button className={s.mcd_btn+" "+ s.mcd_btn2} onClick={() => setMostrarModal2(true)}>
                Agregar usuario
            </button>
            {agregarError}
            <div className={s.tablaContainer}>
                <h2>Lista de Empleados y Administradores</h2>
                <table className={s.tabla}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map((empleado) => (
                            <tr key={empleado.ID_usuario}>
                                <td>{empleado.ID_usuario}</td>
                                <td>{empleado.email}</td>
                                <td>
                                    <select
                                        value={empleado.admin}
                                        onChange={(e) =>
                                            actualizarRol(empleado.ID_usuario, parseInt(e.target.value))
                                        }
                                        class={s.mcd_select}
                                    >
                                        <option value={1}>Administrador</option>
                                        <option value={2}>Empleado</option>
                                        <option value={0}>Cliente</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {mostrarModal2 && (
                <div className={s.modal}>
                    <div className={s.modalContent}>
                        <h2>Agregar Nuevo Empleado</h2>
                        <div className={s.inputet}>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                class={s.mcd_input}
                            />
                        </div>
                        <div className={s.inputet}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            class={s.mcd_input}
                        /></div>
                        <div className={s.inputet}>
                        <label for="rol">Selecciona el Rol:</label>
                        <select
                            value={rol}
                            onChange={(e) => setRol(parseInt(e.target.value))}
                            class={s.mcd_select}
                        >
                            <option value="1">Administrador</option>
                            <option value="2">Empleado</option>
                        </select>
                        </div>
                        <div>
                            <button onClick={agregarUsuario} class={s.mcd_btn}>Enviar</button>
                            <button onClick={() => setMostrarModal2(false)} class={s.mcd_btn}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModal && (
                <div className={s.modal}>
                    <div className={s.modalContent}>
                        <h2>Acceso restringido</h2>
                        <i className={s.rednono + " fa-solid fa-ban"}></i>
                        <p>No tienes permiso para acceder a esta página.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
