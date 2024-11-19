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

API.get("/plato/:id_plato", (req, res) => {
  const { id_plato } = req.params;
  
  DB.query("CALL buscar_plato(?);", [id_plato], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(results[0]);
  });
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

API.get("/carrito/:id_usuario",(req,res)=>{
  const { id_usuario } = req.params;
  DB.query("CALL ObtenerCarritoUsuario(?)",[id_usuario],(err,results)=>{
      if (err) {
          return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json(results[0]);
  })
})
API.get("/pedido/detalle/:id", (req, res) => {
  const { id } = req.params;

  DB.query(
    `SELECT
      pl.ID_plato,
        pd.cantidad, 
        pl.nombre AS nombre_plato, 
        pl.precio 
     FROM restaurante__pedido_detalle pd 
     INNER JOIN restaurante__platos pl ON pd.FK_plato = pl.ID_plato 
     WHERE pd.FK_pedido = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al obtener detalles del pedido", error: err.message });
      }
      res.json(results);
    }
  );
});
API.get('/usuarios', (req, res) => {
  const query = 'SELECT ID_usuario, email, admin FROM restaurante__usuarios WHERE admin IN (1, 2)';
  
  DB.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ message: "Error al obtener los usuarios", error: err.message });
      }
      res.json(results);
  });
});



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
// Endpoint para agregar un nuevo producto
API.post('/menu/create', (req, res) => {
  const { nombre, foto_Url, precio, descripcion, category } = req.body;

  // Insertar el nuevo producto en la base de datos (adaptar según tu base de datos)
  const query = `INSERT INTO restaurante__platos (nombre, foto_Url, precio, descripcion,  FK_ID_categoria) VALUES (?, ?, ?, ?, ?)`;
  DB.query(query, [nombre, foto_Url, precio, descripcion, category], (err, result) => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Error al agregar el producto' });
      }
      res.status(200).json({ success: true, message: 'Producto agregado correctamente' });
  });
});

API.post('/categorias', async (req, res) => {
  const { categoria, img } = req.body; // Asegúrate de que el cliente envíe estos datos
  if (!categoria || !img) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }
  const query = 'INSERT INTO `restaurante__categorias`(`ID_categoria`, `nombre`, `img`) VALUES (NULL,?,?)';

  DB.query(query, [categoria, img], (err, results) => {
    if (err) {
        return res.status(200).json({ message: 'Error al agregar el usuario', error: err.message });
    }
    res.json({ message: 'Categoria agregada correctamente'});
});
  
});
// Endpoint para agregar un nuevo usuario
API.post('/usuarios/agregar', (req, res) => {
  const { email, password, admin } = req.body;

  // Asegúrate de encriptar el password antes de guardarlo (ej. usando bcrypt)
  const query = 'CALL agregar_usuario(?, ?, ?)';

  DB.query(query, [email, password, admin], (err, results) => {
      if (err) {
          return res.status(200).json({ message: 'Error al agregar el usuario', error: err.message });
      }
      res.json({ message: 'Usuario agregado correctamente'});
  });
});

API.post('/usuarios/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const query = 'UPDATE restaurante__usuarios SET admin = ? WHERE ID_usuario = ?';

  DB.query(query, [admin, id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error al actualizar el rol', error: err.message });
      }
      res.json({ message: 'Rol actualizado correctamente' });
  });
});
// User login
API.post("/login", (req, res) => {
  const { email_nick, password } = req.body;
  
  if (!email_nick || !password) {
    return res.status(400).json({ message: "Email y Contraseña son requeridos" });
  }

  DB.query("CALL login(?, ?)", [email_nick, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    
    if (results[0].length <= 0) {
      return res.status(400).json({ message: "Email o Contraseña Incorrecta" });
    }
    res.json({ status: "success",errno:200, data: results[0] });
  });
});

// Register user
API.post("/register", (req, res) => {
  const { email_nick, password } = req.body;
  
  if (!email_nick || !password) {
    return res.status(400).json({ message: "Email y Contraseña son requeridos" });
  }

  DB.query("CALL register(?, ?)", [email_nick, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Perfil creado correctamente" });
  });
});

// Create a new order
API.post("/pedido2/create", (req, res) => {
  const { id_usuario } = req.body;
  
  if (!id_usuario) {
    return res.status(400).json({ message: "id de usuario es requerida" });
  }

  DB.query("CALL CrearPedido(?);", [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Orden creada correctamente" });
  });
});

// Add details to a specific order
API.post("/pedido/create", (req, res) => {
  const { id_producto, id_usuario, cantidad } = req.body;
  let nota = ""; // Puedes ajustar este valor según necesites.

  // Verificar si id_usuario e id_producto están presentes en la solicitud.
  if (!id_usuario || !id_producto) {
    return res.status(400).json({ message: "User ID y Plate ID son requeridos" });
  }

  // Llamar al procedimiento almacenado 'buscarPedido' para obtener o crear el pedido.
  DB.query("CALL buscarPedido(?);", [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    // Acceder al ID del pedido devuelto por el procedimiento almacenado.
    const pedido_id = results[0][0].new_id;

    // Crear un nuevo detalle de pedido usando 'CrearPedidoDetalle'.
    DB.query("CALL CrearPedidoDetalle(?, ?, ?);", [pedido_id, id_producto, cantidad], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json({ status: "success", message: "Detalle a orden añadido correctamente" });
    });
  });
});



API.post("/carrito/comprar", (req, res) => {
  const { id_pedido, id_plato, nota } = req.body;
  
  if (!id_pedido || !id_plato) {
    return res.status(400).json({ message: "Order ID and Plate ID are required" });
  }

  DB.query("CALL CrearPedidoDetalle(?, ?, ?);", [id_pedido, id_plato, nota], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Detalle a orden añadido correctamente" });
  });
});

API.post("/carrito/agregar", (req, res) => {
  const { id_usuario, id_plato, cantidad } = req.body;
  
  DB.query("CALL carritoAgregar(?, ?, ?);", [id_usuario, id_plato, cantidad], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Detalle a orden añadido correctamente" });
  });
});

API.post("/comprar", (req, res) => {
  const {id_pedido } = req.body;
  
  DB.query("CALL actualizar_carrito_a_0(?);", [id_pedido], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ status: "success", message: "Detalle a orden añadido correctamente" });
  });
});

API.post("/pedido/completar/:id", (req, res) => {
  const { id } = req.params;

  DB.query(
    "UPDATE restaurante__pedido SET entregado = 1 WHERE ID_pedido = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al actualizar el pedido", error: err.message });
      }
      res.json({ message: "Pedido completado" });
    }
  );
});
// Endpoint para revertir un pedido a "En proceso"
API.post("/pedido/revertir/:id", (req, res) => {
  const { id } = req.params;

  DB.query(
    "UPDATE restaurante__pedido SET entregado = 0 WHERE ID_pedido = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al revertir el pedido", error: err.message });
      }
      res.json({ message: "Pedido revertido a 'En proceso'" });
    }
  );
});

/**
8888888b.  8888888888 888      8888888888 88888888888 8888888888 
888  "Y88b 888        888      888            888     888        
888    888 888        888      888            888     888        
888    888 8888888    888      8888888        888     8888888    
888    888 888        888      888            888     888        
888    888 888        888      888            888     888        
888  .d88P 888        888      888            888     888        
8888888P"  8888888888 88888888 8888888888     888     8888888888 
 */

API.delete("/carrito/eliminar/:id_detalle", (req, res) => {
  const { id_detalle } = req.params;
  DB.query("DELETE FROM restaurante__pedido_detalle WHERE ID_detalle = ?", [id_detalle], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar el item", error: err.message });
    }
    res.json({ status: "success", message: "Item eliminado correctamente" });
  });
});

/**

8888888b.  888     888 88888888888 
888   Y88b 888     888     888     
888    888 888     888     888     
888   d88P 888     888     888     
8888888P"  888     888     888     
888        888     888     888     
888        Y88b. .d88P     888     
888         "Y88888P"      888     
 */
API.put("/carrito/actualizar", (req, res) => {
  const { id_detalle, cantidad } = req.body;
  DB.query("UPDATE restaurante__pedido_detalle SET cantidad = ? WHERE ID_detalle = ?", [cantidad, id_detalle], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al actualizar la cantidad", error: err.message });
    }
    res.json({ status: "success", message: "Cantidad actualizada correctamente" });
  });
});

API.put('/menu/update/:id', async (req, res) => {
  const productId = req.params.id;
  const { nombre, foto_Url, precio, descripcion } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!nombre || !foto_Url || !precio || !descripcion) {
    return res.status(400).json({ success: false, message: 'Faltan datos del producto.' });
  }

  try {
    // Consulta para actualizar el producto
    const query = `
      UPDATE restaurante__platos
      SET nombre = ?, foto_Url = ?, precio = ?, descripcion = ?
      WHERE ID_plato = ?;
    `;

    // Ejecutar la consulta
    const result = DB.query(query, [nombre, foto_Url, precio, descripcion, productId]);
      res.json({ success: true, message: 'Producto actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
});

API.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
