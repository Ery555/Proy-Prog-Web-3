const pool = require('../config/db');

// 1. Obtener todas las aseguradoras ACTIVAS
const getAseguradoras = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM aseguradora WHERE is_active = true ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener aseguradoras' });
    }
};

// 2. Crear una nueva aseguradora
const crearAseguradora = async (req, res) => {
    const { nombre, nit, direccion, telefono } = req.body;
    try {
        const nueva = await pool.query(
            `INSERT INTO aseguradora (nombre, nit, direccion, telefono) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, nit, direccion, telefono]
        );
        res.status(201).json(nueva.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear la aseguradora' });
    }
};

// 3. Eliminación Lógica
const eliminarAseguradora = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE aseguradora SET is_active = false WHERE id_aseguradora = $1 RETURNING *',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Aseguradora no encontrada' });
        }
        res.json({ mensaje: 'Aseguradora desactivada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar aseguradora' });
    }
};

module.exports = { getAseguradoras, crearAseguradora, eliminarAseguradora };