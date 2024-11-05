const express = require('express');
const router = express.Router();

// Importamos la conexión a la base de datos
const mysql = require('mysql2');
const db = require('../index.js').db;

// Ruta para obtener todos los productos
router.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos', details: err });
    }
    res.json(results);
  });
});

// Ruta para obtener un producto por ID
router.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el producto', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(results[0]);
  });
});

// Ruta para agregar un nuevo producto
router.post('/productos', (req, res) => {
  const { nombre, precio } = req.body;
  db.query(
    'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
    [nombre, precio],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al agregar producto', details: err });
      }
      res.status(201).json({ id: result.insertId, nombre, precio });
    }
  );
});

// Ruta para actualizar un producto
router.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;
  db.query(
    'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?',
    [nombre, precio, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar producto', details: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ id, nombre, precio });
    }
  );
});

// Ruta para eliminar un producto
router.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar producto', details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

module.exports = router;
