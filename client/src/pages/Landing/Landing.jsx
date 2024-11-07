import React from 'react'
import CarouselDefault from "../../components/Carousel/Carousel"
import Cards from "../../components/CardsBanners/CardsBanners"
import Footer from "../../components/Footer/Footer"
import s from "./Landing.module.css"

export default function Landing() {
  return(
    <>
      <div className={s.carouselContainer}><CarouselDefault/></div>
      <div className={s.cardsContainer}>
        <Cards/>
      </div>
      <Footer/>
    </>
  )
}