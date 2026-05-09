const pool = require('../config/db');

// 1. Obtener todas las pólizas con los nombres de Cliente y Aseguradora
const getPolizas = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.*, 
                c.nombre AS cliente_nombre, 
                a.nombre AS aseguradora_nombre 
            FROM poliza_seguro p
            JOIN cliente c ON p.id_cliente = c.id_cliente
            JOIN aseguradora a ON p.id_aseguradora = a.id_aseguradora
            WHERE p.is_active = true
            ORDER BY p.fin_vigencia ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener pólizas' });
    }
};

// 2. Crear una nueva póliza
const crearPoliza = async (req, res) => {
    const { 
        id_cliente, 
        id_aseguradora, 
        numero_codigo_poliza, 
        tipo_poliza, 
        direccion_poliza, 
        inicio_vigencia, 
        fin_vigencia 
    } = req.body;

    try {
        const nuevaPoliza = await pool.query(
            `INSERT INTO poliza_seguro 
            (id_cliente, id_aseguradora, numero_codigo_poliza, tipo_poliza, direccion_poliza, inicio_vigencia, fin_vigencia) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [id_cliente, id_aseguradora, numero_codigo_poliza, tipo_poliza, direccion_poliza, inicio_vigencia, fin_vigencia]
        );
        res.status(201).json(nuevaPoliza.rows[0]);
    } catch (error) {
        console.error(error);
        // Si el código de póliza ya existe, Postgres lanzará un error de llave única (Unique Violation)
        if (error.code === '23505') {
            return res.status(400).json({ mensaje: 'El número de póliza ya está registrado.' });
        }
        res.status(500).json({ mensaje: 'Error al crear póliza' });
    }
};

// 3. Eliminación Lógica
const eliminarPoliza = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE poliza_seguro SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id_poliza = $1 RETURNING *',
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Póliza no encontrada' });
        }
        
        res.json({ mensaje: 'Póliza anulada/desactivada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar póliza' });
    }
};

module.exports = { getPolizas, crearPoliza, eliminarPoliza };