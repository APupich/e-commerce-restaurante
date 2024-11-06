import React from 'react'
import Header from "../../components/Header/Header"
import Landing from "../../pages/Landing/Landing"
import s from "./MainLayout.module.css"

export default function MainLayout() {
	return (
		<>
			<Header />
			<main className={s.main}>
				<Landing />
			</main>
		</>
	)
}
