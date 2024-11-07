import React, { useState, useEffect } from "react";
import s from "./Carousel.module.css"; // Importa el archivo CSS como un módulo

export default function CarouselDefault() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    "/banners/mobile/BANNER_WEB_MOBILE_320x480_1fd4d978f6.jpg",
    "/banners/mobile/Banners_Grand_Tasty_Nuevo_Pan_320x480_1_9c33627565.jpg",
    "/banners/mobile/Roblox_MP_320x480_fc52087cf5.jpg",
    "/banners/mobile/Banner_APP_WEB_Mc_Melt_320x480_1_12c6f3160c.jpg",
    "/banners/mobile/320x480_Banner_WEB_My_M_Digital_b3c7414bda.gif",
    "/banners/mobile/320x481_948b497e9b.jpg",
    "/banners/mobile/Banner_APP_WEB_piletacheddar_320x480_web_mobile_0605b5a774.jpg",
    "/banners/mobile/Banner_Web_GTTB_320x480_b0dc5d9efc.jpg",
  ];

  const totalSlides = slides.length;

  const moveSlide = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
      newIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
      newIndex = 0;
    }
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveSlide(1);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className={s["slider-container"]}>
      <div className={s.slider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((src, index) => (
          <div className={s.slide} key={index}>
            <img src={src} alt={`Imagen ${index + 1}`} />
          </div>
        ))}
      </div>
      <button className={s.prev} onClick={() => moveSlide(-1)}>
        ❮
      </button>
      <button className={s.next} onClick={() => moveSlide(1)}>
        ❯
      </button>
    </div>
  );
}
