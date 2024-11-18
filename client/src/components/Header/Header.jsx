import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Header.module.css';

export default function Header() {
  const [asideActive, setAsideActive] = useState(false);
  const navigate = useNavigate(); // Usamos el hook useNavigate para redirigir después de deslogearse

  const toggleAside = () => {
    setAsideActive(prevState => !prevState);
  }

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("user_id"); // Eliminar el usuario del localStorage
    localStorage.removeItem("admin"); // Eliminar el usuario del localStorage
    localStorage.removeItem("employee"); 
    localStorage.clear();
    navigate("/"); // Redirigir a la página de inicio (puedes cambiar esta ruta si lo prefieres)
  }

  const isLoggedIn = localStorage.getItem("user_id");
  const isAdmin = JSON.parse(localStorage.getItem("admin")) ;
  const isEmployee= JSON.parse(localStorage.getItem("employee")) ;
  console.log(isAdmin) 
  console.log(isEmployee)

  return (
    <>
      {!asideActive ? (
        <header className={s.header}>
          <a href="/"><img src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png" alt="McDonald's Logo" /></a>
          <div className={s.btn_menu} onClick={toggleAside}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </header>
      ) : (
        <header className={s.aside}>
          <a href="/"><img className={s.img} src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png" alt="McDonald's Logo" /></a>
          <div className={s.btn_close} onClick={toggleAside}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className={s.tabs}>
            <Link className={s.tab} to="/productos">
              <span>Productos</span>
              <div className={s.btn_expand}>
                <i className="fa-solid fa-burger"></i>
              </div>
            </Link>

            <Link className={s.tab} to="/carrito">
              <span>Carrito</span>
              <div className={s.btn_expand}>
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
            </Link>
            {(isAdmin || isEmployee) && (
              <Link className={s.tab} to="/admin">
                <span>Admin</span>
                <div className={s.btn_expand}>
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                </div>
              </Link>
            )}
          </div>
          <div className={s.login}>
            {isLoggedIn ? (
              <button className={s.boton} onClick={handleLogout}>
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Salir</span>
              </button>
            ) : (
              <Link to="login" onClick={toggleAside}>
                
                <img src="/logos/79_15_1_icone_70x70_bf9839ed7c.png" alt="Login Icon"/>
                <span>Ingresá</span>
              </Link>
            )}
          </div>
        </header>
      )}
    </>
  );
}
