import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "../../components/Header/Header"
import Footer from '../../components/Footer/Footer'
import s from "./MainLayout.module.css"

export default function MainLayout() {
	return (
		<>
			<Header />
			<main className={s.main}>
				<Outlet/>
				<Footer/>
			</main>
		</>
	)
}
