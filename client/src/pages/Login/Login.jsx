import React, { useState } from 'react'
import s from "./Login.module.css";
import { Link } from 'react-router-dom';

const ENDPOINT = {
	LOGIN: "http://localhost/API-kiwi/user/login",
	REGISTER: "http://localhost/API-kiwi/user/register"
};

async function dataFetch(name,pass) {
	let bodyContent = JSON.stringify({"email_nick": name,"password": pass});

	let response = await fetch(ENDPOINT.LOGIN, {
		method: "POST",
		credentials: 'include',
		body: bodyContent,
		headers: {
            "Content-Type": "application/json"
        },
	});
	console.log(response)
	let data = await response.json();
	return(await data);
}

async function dataRegister(email,username,password,rpassword) {
	let bodyContent = JSON.stringify({"email": email,"nickname": username,"password": password,"repeat_password": rpassword});

	let response = await fetch(ENDPOINT.REGISTER, {
		method: "POST",
		body: bodyContent,
		headers: {
            "Content-Type": "application/json"
        },
	});
	console.log(response)
	let data = await response.json();
	return(await data);
}
// let data = await dataFetch();
// momentaneo, sacar luego de pruebas
// localStorage.clear();

export default function Login() {
	let [pass,setPass] = useState("");
	let [error2,setError2] = useState("");
	let [name,setName] = useState("");
	let [email,setEmail] = useState("");
	let [username,setUsername] = useState("");
	let [password,setPassword] = useState("");
	let [rpassword,setRpassword] = useState("");
	let [cambio,setCambio] = useState(true);
	let [checkbox, setCheckbox] = useState(false);

	const [loading,setLoading] = useState(false);
	const [dataLogin, setDataLogin] = useState(null);
	const [error, setError] = useState(null);

	const [warn, setWarn] = useState(false);

	async function loguearse(){
		setLoading(true)
		let data = await dataFetch(name,pass);
		
		try {
			let data = await dataFetch(name,pass);
			setDataLogin(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}

		setLoading(false)
		console.log(data.error)
		setError2(data.error);
		if (data.errno == 200) {
			localStorage.setItem("user",true);
			localStorage.setItem("username", data.user.nickname);
			localStorage.setItem("name", data.user.name);
			localStorage.setItem("surname", data.user.surname);
			localStorage.setItem("email", data.user.email);
			localStorage.setItem("avatar", data.user.avatar);
			
			console.log(data)
			window.location.href = "/"
		}
	}
	async function registrarse(){
		if(warn) return;

		let data = await dataRegister(email,username,password,rpassword);
		setError2(data.error);
		if (data.errno == 200) {
			console.log(data)
		}
	}
	function onchangePass({target}){
		setPass(target.value);
	}
	function onchangeName({target}){
		setName(target.value);
	}
	function onchangeEmail({target}){
		setEmail(target.value);
	}
	function onchangeUsername({target}){
		setUsername(target.value);
		setWarn(StrFilter(username));
	}
	function onchangePassword({target}){
		setPassword(target.value);
	}
	function onchangeRpassword({target}){
		setRpassword(target.value);
	}
	function cambiarForm(){
		setError2("");
		setCambio(!cambio);
	}
	function toggleCheckbox(){
		setCheckbox(!checkbox);
	};

	document.addEventListener('keypress', function(evt) {

		// Si el evento NO es una tecla Enter
		if (evt.key !== 'Enter') return;
		
		// Si el evento NO fue lanzado por un elemento con class "focusNext"
		let element = evt.target;
		if (!element.classList.contains('focusNext')) return;
	  
		// AQUI logica para encontrar el siguiente
		let tabIndex = element.tabIndex + 1;
		var next = document.querySelector('[tabindex="'+tabIndex+'"]');
	  
		// Si NO encontramos un elemento siguiente
		if (!next) return;

		// Si detectamos un advertencia de palabra prohibida
		if(warn) {
			console.log("warning: "+warn)
			return;
		}

		// Si finalmente se puede ejecutar el tab
		if(next.getAttribute("type") == 'submit') {
			next.dispatchEvent(new MouseEvent('click', {bubbles: true}));
		}else{
			next.focus();
		}
	});

	// console.log(data.user.nickname)
	return (<>
		<span className={s.overlay+" "+(loading? s.visible : '')}>
			
			{error? "error: "+error : ''}
		</span>
		<div className={s.loginContainer}>
			<Link to="/landing" className={s.brand}>
				<img src="https://cdn.pixabay.com/photo/2021/09/22/17/17/mcdonalds-6647433_960_720.png" alt="Kiwi Logo" className={s.kiwi_logo}/>
			</Link>
			<div className={s.container}>
				<div className={s.switchero+" "+(!cambio?s.op2:"")}>
					<button className={s.switch+" "+(cambio?s.selected:"")} id="login" onClick={cambiarForm}>Login</button>
					<button className={s.switch+" "+(!cambio?s.selected:"")} id="register" onClick={cambiarForm}>Register</button>
				</div>
				<div className={(cambio)?(s.form):(s.dnone)} id='loginForm'>
					<label htmlFor="error" className={s.error}>{error2}</label>
					<input id="loginName" tabIndex="1" className='focusNext' type="text" name="email_nick" required onChange={onchangeName} placeholder='Username or email'/>

					<input id="password" tabIndex="2" className='focusNext' type="password" name="password" required onChange={onchangePass} placeholder='Password'/>

					<label className={s.checkbox}>
						<div className={s.cb_input} onClick={toggleCheckbox}><i className={`fa-solid fa-check ${checkbox ? '' : s.dnone}`}></i></div>
						<span className={s.cb_span}>Remember me</span>
					</label>

					<button type="submit" tabIndex="3" className={'focusNext '+s.submit} value="Login" name="login" onClick={loguearse}>Login</button>
				</div>
				<div className={(!cambio)?(s.form):(s.dnone)} id='registerForm'>
					<label htmlFor="error" className={s.error}>{error2}</label>

					<input id="email" tabIndex="4" className='focusNext' type="email" name="email" required onChange={onchangeEmail} placeholder='Email'/>

					<span className={s.filter}>
						<input id="username" tabIndex="5" className='focusNext' type="text" name="username" required onChange={onchangeUsername} placeholder='Username'/>
						<p className={warn? s.warn : s.disable}>{warn? 'Nombre Inadecuado' : ''}</p>
					</span>

					<input id="rpassword" tabIndex="6" className='focusNext' type="password" name="password" required onChange={onchangePassword} placeholder='Password'/>

					<input id="rpassword2" tabIndex="7" className='focusNext' type="password" name="rpassword" required onChange={onchangeRpassword} placeholder='Repeat Password'/>

					<button type="submit" tabIndex="8" className={s.submit+" focusNext "+(warn? s.btn_disable : '')} value="Register" name="register" onClick={registrarse}>Register</button>
				</div>
			</div>
		</div>
	</>
	)
} 