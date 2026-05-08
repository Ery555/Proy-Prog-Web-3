const express = require('express');
const router = express.Router();
const { getClientes, crearCliente, eliminarCliente } = require('../controllers/clienteController');
const { verificarToken } = require('../middleware/authMiddleware');

// Todas estas rutas requieren Token
router.get('/', verificarToken, getClientes);
router.post('/', verificarToken, crearCliente);
router.put('/eliminar/:id', verificarToken, eliminarCliente); // Usamos PUT porque solo editamos el campo is_active

module.exports = router;