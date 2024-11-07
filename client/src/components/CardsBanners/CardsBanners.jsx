import { useEffect, useState } from 'react';
import s from "./Cards.module.css"

export default function Cards(){
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    fetch('/banners/cards.json')
      .then((response) => response.json())
      .then((data) => setCardsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      {cardsData.map((card) => (
        <div key={card.id} className={s.card}>
          <img src={card.ref} alt={card.title} />
					<div className={s.info}>
						<h3>{card.title}</h3>
          	<p>{card.desc}</p>
					</div>
					{card.btn_enabled?<a>{card.desc_btn}</a>:<></>}
        </div>
      ))}
    </>
  );
};