import React, { useEffect, useRef, useState } from 'react';
import s from './Panel.module.css'
import { Link } from 'react-router-dom';

export default function Footer() {

	return (
		<>
			<br /><h2> - Panel de administrador</h2>
			<div className={s.main}>
				<div className={s.conteiner}>
					<Link className={s.cart} to="pedidos">
						<i class="fa-solid fa-receipt"></i>
						<div className={s['item-info']}>
							<h3>Pedidos</h3>
						</div>
					</Link>
					<Link className={s.cart} to="empleados">
						<i class="fa-solid fa-users-gear"></i>
						<div className={s['item-info']}>
							<h3>Empleados</h3>
						</div>
					</Link>
					<Link className={s.cart} to="stats">
					<i class="fa-solid fa-chart-simple"></i>
						<div className={s['item-info']}>
							<h3>Stats</h3>
						</div>
					</Link>
					<Link className={s.cart} to="productos">
					<i class="fa-solid fa-utensils"></i>
						<div className={s['item-info']}>
							<h3>Productos</h3>
						</div>
					</Link>
				</div>
				
			</div>

		</>
	);
}
