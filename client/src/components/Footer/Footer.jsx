import React, { useEffect, useRef, useState } from 'react';
import s from "./Footer.module.css";

export default function Footer() {
	const [isAnimated, setIsAnimated] = useState(false);
	const svgContainerRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsAnimated(true);
					observer.disconnect();
				}
			},
			{
				threshold: 0.5,
			}
		);

		if (svgContainerRef.current) {
			observer.observe(svgContainerRef.current);
		}

		return () => {
			if (svgContainerRef.current) {
				observer.unobserve(svgContainerRef.current);
			}
		};
	}, []);

	return (
		<footer className={s.footer}>
			<div className={s.marco}>
				<div className={s.img}>
					<img src="/logos/mcdonalds-logo-bg-red.png" alt="McDonald's logo" />
					<h2>Descárgate nuestra app</h2>
				</div>
				<span>Descárgate nuestra app y no te pierdas nuestras novedades</span>
				<a>Descargar Ahora</a>
				<div
					ref={svgContainerRef}
					className={`${s.svgContainer} ${isAnimated ? s.isAnimated : ''}`}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="320" height="16" viewBox="0 0 320 16" className="mcd-svg-drops-mobile is-hidden-desktop">
						<g fill="none" fillRule="evenodd">
							<g fill="#FFBC0D">
								<g>
									<path d="M241 0h2.673c8.214.335 12.377 8.872 21.064 7.531 3.134-.483 5.743-2.316 9.017-2.343 7.835-.063 11.681 8.966 18.99 10.531 2.192.47 4.494.408 6.522-.623 1.779-.903 3.16-2.399 4.358-3.963 2.07-2.705 3.912-5.636 6.386-8.004 1.346-1.286 2.97-2.481 4.815-2.874.716-.153 1.44-.217 2.165-.255H320M0 0c28.903 0 37.863 13 50.87 13C66.478 13 76.304 0 98.56 0c16.258 0 21.298 7.313 28.614 7.313C135.954 7.313 141.482 0 154 0" transform="translate(0 -198) translate(0 198)"></path>
								</g>
							</g>
						</g>
					</svg>
				</div>
			</div>
			<div className={s.social}>
				<ul>
					<li><i class="fa-brands fa-linkedin"></i></li>
					<li><i class="fa-brands fa-github"></i></li>
					<li><i class="fa-solid fa-envelope"></i></li>
				</ul>
			</div>
			<div className={s.descargas}>
				<ul>
					<li><img src="/logos/app_store_3x_d293084ca1.png"/></li>
					<li><img src="/logos/disponible_google_play_3x_c977cae3bc.png"/></li>
				</ul>
			</div>
			<div className={s.mcd_container}>
				<div className={s.referencias}>
					<ul>
						<li>Política de Privacidad</li>
						<li>Defensa del Consumidor</li>
						<li>Protección de datos personales</li>
						<li>Contacto</li>
					</ul>
				</div>
				<div className={s.marca}>
					<img src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png"/>
					<span>© McChaza's 2024</span>
				</div>
			</div>
		</footer>
	);
}
