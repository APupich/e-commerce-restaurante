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

API.listen(PORT,()=>{
    console.log("Listening port: ",PORT)
});