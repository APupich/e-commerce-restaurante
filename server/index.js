const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const API = express();

// Configura CORS para permitir solo peticiones desde http://localhost:3000
API.use(cors({
  origin: 'http://localhost:5173'
}));

API.use(express.json());

// Resto de la configuración y endpoints...

// Use a connection pool for better performance and scalability
const DB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
DB.getConnection((err) => {
  if (err) {
    console.error("Connection error: ", err);
    return;
  }
  console.log("Connected to database");
});

const PORT = 3000;
/**
     .d8888b.   8888888888 88888888888 
    d88P  Y88b  888            888     
    888    888  888            888     
    888         8888888        888     
    888  88888  888            888     
    888    888  888            888     
    Y88b  d88P  888            888     
    "Y8888P88   8888888888     888                               
 */
API.get("/", (req, res) => {
  res.send("Hola pupi");
});

// Get the menu for the restaurant
API.get("/menu", (req, res) => {
  DB.query("CALL ListarMenuRestaurante(1);", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(results[0]);
  });
});

// Get menu items by category
API.get("/menu/:category2", (req, res) => {
  const { category2 } = req.params;
  const category = capitalize(category2);
  
  DB.query("CALL ListarPlatosPorCategoria(?);", [category], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(results[0]);
  });
});

// Get orders by date
API.get("/pedido/:date", (req, res) => {
  const { date } = req.params;
  
  DB.query("CALL ListarPedidosDelDia(?);", [date], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(results[0]);
  });
});
API.get("/categorias",(req,res)=>{
    DB.query("CALL ListarCategorias()",[],(err,results)=>{
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.json(results[0]);
    })
})
/**
    8888888b.   .d88888b.   .d8888b. 88888888888 
    888   Y88b d88P" "Y88b d88P  Y88b    888     
    888    888 888     888 Y88b.         888     
    888   d88P 888     888  "Y888b.      888     
    8888888P"  888     888     "Y88b.    888     
    888        888     888       "888    888     
    888        Y88b. .d88P Y88b  d88P    888     
    888         "Y88888P"   "Y8888P"     888 
 */
// User login
API.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  DB.query("CALL login(?, ?)", [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    
    if (results[0].length <= 0) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }
    res.json({ status: "success", data: results[0] });
  });
});

// Register user
API.post("/register", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  DB.query("CALL register(?, ?)", [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Profile created successfully" });
  });
});

// Create a new order
API.post("/pedido/create", (req, res) => {
  const { id_usuario } = req.body;
  
  if (!id_usuario) {
    return res.status(400).json({ message: "User ID is required" });
  }

  DB.query("CALL CrearPedido(?);", [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Order created successfully" });
  });
});

// Add details to a specific order
API.post("/pedido_detalle/create", (req, res) => {
  const { id_pedido, id_plato, nota } = req.body;
  
  if (!id_pedido || !id_plato) {
    return res.status(400).json({ message: "Order ID and Plate ID are required" });
  }

  DB.query("CALL CrearPedidoDetalle(?, ?, ?);", [id_pedido, id_plato, nota], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Order detail added successfully" });
  });
});

API.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
