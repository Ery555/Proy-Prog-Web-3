const express = require('express');
const router = express.Router();
const { getSiniestros, crearSiniestro, actualizarEstadoSiniestro, eliminarSiniestro } = require('../controllers/siniestroController');
const { verificarToken } = require('../middleware/authMiddleware');

// Todas las rutas protegidas
router.get('/', verificarToken, getSiniestros);
router.post('/', verificarToken, crearSiniestro);
router.put('/actualizar/:id', verificarToken, actualizarEstadoSiniestro); // Ruta extra para cambiar estados
router.put('/eliminar/:id', verificarToken, eliminarSiniestro);

module.exports = router;