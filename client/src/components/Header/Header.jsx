import { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './Header.module.css';

export default function Header() {
  const [asideActive, setAsideActive] = useState(false);

  const toggleAside = () => {
    setAsideActive(prevState => !prevState);
  }

  return (
    <>
      {!asideActive ? (
        <header className={s.header}>
          <img src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png" alt="McDonald's Logo" />
          <div className={s.btn_menu} onClick={toggleAside}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </header>
      ) : (
        <header className={s.aside}>
          <img className={s.img} src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png" alt="McDonald's Logo" />
          <div className={s.btn_close} onClick={toggleAside}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className={s.tabs}>
            <Link className={s.tab} to="">
              <span>Productos</span>
              <div className={s.btn_expand}>
                <i className="fa-solid fa-burger"></i>
              </div>
            </Link>

            <Link className={s.tab}>
              <span>Carrito</span>
              <div className={s.btn_expand}>
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
            </Link>
          </div>
          <div className={s.login}>
            <Link to="login" onClick={toggleAside}>
              <img src="/logos/79_15_1_icone_70x70_bf9839ed7c.png"/>
              <span>Ingresá</span>
            </Link>
          </div>
        </header>
      )}
    </>
  );
}
