const express = require('express');
const router = express.Router();
const { getAseguradoras, crearAseguradora, eliminarAseguradora } = require('../controllers/aseguradoraController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', verificarToken, getAseguradoras);
router.post('/', verificarToken, crearAseguradora);
router.put('/eliminar/:id', verificarToken, eliminarAseguradora);

module.exports = router;