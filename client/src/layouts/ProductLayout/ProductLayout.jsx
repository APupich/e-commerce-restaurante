import React from 'react'
import { Outlet } from 'react-router-dom'
import ProductHeader from "../../components/ProductHeader/ProductHeader"
import Footer from '../../components/Footer/Footer'
import s from "./ProductLayout.module.css"

export default function ProductLayout() {
	return (
		<>
			<ProductHeader />
			<main className={s.main}>
				<Outlet/>
				<Footer/>
			</main>
		</>
	)
}
