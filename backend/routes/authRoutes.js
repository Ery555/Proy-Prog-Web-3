const express = require('express');
const router = express.Router();
const {verificarToken} = require('../middleware/authMiddleware');
const {getAsesores} = require('../controllers/authController');
const { registrarUsuario, loginUsuario } = require('../controllers/authController');

// Ruta para registrar: POST http://localhost:3000/api/auth/register
// ... (lo que ya tenías)
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario); // NUEVA RUTA
router.get('/asesores', verificarToken, getAsesores);
module.exports = router;
