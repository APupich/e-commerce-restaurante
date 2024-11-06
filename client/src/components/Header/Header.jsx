import { useState } from 'react'
import s from './Header.module.css'

export default function Header() {

  return (
    <>
      <header className={s.header}>
        <img src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png"/>
        <div className={s.btn_menu}><i className="fa-solid fa-bars"></i></div>
      </header>
    </>
  )
}
