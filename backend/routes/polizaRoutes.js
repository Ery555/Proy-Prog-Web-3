const express = require('express');
const router = express.Router();
const { getPolizas, crearPoliza, eliminarPoliza } = require('../controllers/polizaController');
const { verificarToken } = require('../middleware/authMiddleware');

// Protegemos todas las rutas
router.get('/', verificarToken, getPolizas);
router.post('/', verificarToken, crearPoliza);
router.put('/eliminar/:id', verificarToken, eliminarPoliza);

module.exports = router;