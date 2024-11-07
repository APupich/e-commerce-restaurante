import { useState } from 'react';
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
          <img src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png" alt="McDonald's Logo" />
          <div className={s.btn_close} onClick={toggleAside}>
            <i class="fa-solid fa-xmark"></i>
          </div>
        </header>
      )}
    </>
  );
}
