const pool = require('../config/db');

// 1. Obtener todos los contratos activos con el nombre del cliente
const getContratos = async (req, res) => {
    try {
        const query = `
            SELECT c.*, cl.nombre AS cliente_nombre 
            FROM contrato_servicios c
            JOIN cliente cl ON c.id_cliente = cl.id_cliente
            WHERE c.is_active = true
            ORDER BY c.fecha_fin ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener contratos' });
    }
};

// 2. Crear un nuevo contrato
const crearContrato = async (req, res) => {
    const { id_cliente, codigo, fecha_inicio, fecha_fin, importe } = req.body;
    try {
        const nuevoContrato = await pool.query(
            `INSERT INTO contrato_servicios (id_cliente, codigo, fecha_inicio, fecha_fin, importe) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_cliente, codigo, fecha_inicio, fecha_fin, importe]
        );
        res.status(201).json(nuevoContrato.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear contrato (el código podría estar duplicado)' });
    }
};

// 3. Asignar un Asesor a un Contrato (Tabla usuario_contrato)
const asignarAsesor = async (req, res) => {
    const { id_contrato, id_usuario } = req.body;
    try {
        await pool.query(
            'INSERT INTO usuario_contrato (id_contrato, id_usuario) VALUES ($1, $2)',
            [id_contrato, id_usuario]
        );
        res.json({ mensaje: 'Asesor asignado correctamente al contrato' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al asignar asesor' });
    }
};

// 4. Eliminación Lógica
const eliminarContrato = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            'UPDATE contrato_servicios SET is_active = false WHERE id_contrato = $1',
            [id]
        );
        res.json({ mensaje: 'Contrato desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar contrato' });
    }
};

module.exports = { getContratos, crearContrato, asignarAsesor, eliminarContrato };