const pool = require('../config/db');

// 1. Obtener todos los clientes ACTIVOS
const getClientes = async (req, res) => {
    try {
        // Actualizado: tabla 'cliente' y llave 'id_cliente'
        const result = await pool.query('SELECT * FROM cliente WHERE is_active = true ORDER BY id_cliente ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener clientes' });
    }
};

// 2. Crear un nuevo cliente con todos los campos
const crearCliente = async (req, res) => {
    // Extraemos todos los campos que definiste en el DBML
    const { 
        nombre, sigla, nit, direccion, 
        representante_nombre, representante_email, representante_telefono,
        contacto_nombre, contacto_cargo, contacto_email, contacto_telefono
    } = req.body;

    try {
        const nuevoCliente = await pool.query(
            `INSERT INTO cliente 
            (nombre, sigla, nit, direccion, representante_nombre, representante_email, representante_telefono, contacto_nombre, contacto_cargo, contacto_email, contacto_telefono) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [nombre, sigla, nit, direccion, representante_nombre, representante_email, representante_telefono, contacto_nombre, contacto_cargo, contacto_email, contacto_telefono]
        );
        res.status(201).json(nuevoCliente.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear cliente' });
    }
};

// 3. Eliminación Lógica
const eliminarCliente = async (req, res) => {
    const { id } = req.params; // Viene de la URL /api/clientes/eliminar/:id
    try {
        // Actualizado: tabla 'cliente' y condición 'id_cliente'
        const result = await pool.query(
            'UPDATE cliente SET is_active = false WHERE id_cliente = $1 RETURNING *', 
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        
        res.json({ mensaje: 'Cliente desactivado correctamente', cliente: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar cliente' });
    }
};

module.exports = { getClientes, crearCliente, eliminarCliente };