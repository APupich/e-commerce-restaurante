// Importamos los módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/routes');

// Configuramos dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config();

// Creamos la conexión con la base de datos usando las variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Intentamos conectar con la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Creamos la aplicación Express
const app = express();

// Usamos middleware para poder recibir datos JSON en las solicitudes
app.use(express.json());

// Configuramos las rutas de nuestra API
app.use('/api', apiRoutes);

// Definimos el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
