const express = require('express');
const router = express.Router();
const { getContratos, crearContrato, asignarAsesor, eliminarContrato } = require('../controllers/contratoController');
const { verificarToken } = require('../middleware/authMiddleware');

// Todas las rutas protegidas por JWT
router.get('/', verificarToken, getContratos);
router.post('/', verificarToken, crearContrato);
router.post('/asignar', verificarToken, asignarAsesor);
router.put('/eliminar/:id', verificarToken, eliminarContrato);

module.exports = router;