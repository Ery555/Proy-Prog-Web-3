const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Importamos la conexión
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const { verificarToken } = require('./middleware/authMiddleware');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', async (req, res) => {
    try {
        // Hacemos una consulta simple para verificar
        const result = await pool.query('SELECT NOW()');
        res.json({
            mensaje: 'Servidor y Base de Datos conectados 🚀',
            hora_db: result.rows[0].now
        });
    } catch (err) {
        res.status(500).send('Error de conexión con la DB');
    }
});
app.use('/api/auth', authRoutes); // Aquí conectamos las rutas de autenticación
app.get('/api/perfil', verificarToken, (req, res) => {
    res.json({ mensaje: 'Bienvenido al área protegida', usuario: req.usuario });
});
app.use('/api/clientes', clienteRoutes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});