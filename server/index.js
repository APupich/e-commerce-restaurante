const express = require('express');
const mysql = require('mysql2');
require('dotenv').config()

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


const API = express();
API.use(
    express.json()
);

const DB = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD, 
    database : process.env.DB_NAME
})

DB.connect((err)=>{
    if (err) {
        console.error("Connect error: ",err);
        return;
    }
    console.log("Conectado");
})
const PORT = 3000;

API.get("/",(req,res)=>{
    res.send("Hola pupi");
})

API.get("/menu",(req,res)=>{
    DB.query("CALL ListarMenuRestaurante(1);",(err,results)=>{
        if (err) {
            res.json({message:err.message});
            return;
        }
        res.json(results[0]);
    })
})

API.get("/menu/:category2",(req,res)=>{
    let {category2} = req.params;
    const category = capitalize(category2);
    DB.query("CALL ListarPlatosPorCategoria(?);",
        [category],(err,results)=>{
        if (err) {
            res.json({message:err.message});
            return;
        }
        res.json(results[0]);
    })
})

API.get("/pedido/:date",(req,res)=>{
    const {date} = req.params;
    DB.query("CALL ListarPedidosDelDia(?);",
        [date],(err,results)=>{
        if (err) {
            res.json({message:err.message});
            return;
        }
        res.json(results[0]);
    })
})
API.post("/login",(req,res)=>{
    const {email,password} = req.body;
    DB.query("CALL login(?,?)",[email,password],(err,results)=>{
        if (err) {
            res.json({message:err.message})
            return;
        }
        if (results[0].length<=0) {
            res.json({errno:400,error:"email o contraseña incorrecta"});
        }else{
            res.json(results[0])
        }
    })
})

API.post("/register",(req,res)=>{
    const {email,password} = req.body;
    DB.query("CALL register(?,?)",[email,password],(err,results)=>{
        if (err) {
            res.json({errno:400,message:err.message})
            return;
        }
        res.json({errno:200,error:"perfil creado correctamente"});
    })
})
API.listen(PORT,()=>{
    console.log("Listening port: ",PORT)
});