const pool = require('../config/db');

// 1. Obtener todos los siniestros con información de la póliza, cliente y aseguradora
const getSiniestros = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.*, 
                p.numero_codigo_poliza, 
                c.nombre AS cliente_nombre, 
                a.nombre AS aseguradora_nombre
            FROM siniestro s
            JOIN poliza_seguro p ON s.id_poliza = p.id_poliza
            JOIN cliente c ON p.id_cliente = c.id_cliente
            JOIN aseguradora a ON p.id_aseguradora = a.id_aseguradora
            WHERE s.is_active = true
            ORDER BY s.fecha_ocurrencia DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener siniestros' });
    }
};

// 2. Registrar un nuevo siniestro
const crearSiniestro = async (req, res) => {
    const { 
        id_poliza, 
        fecha_ocurrencia, 
        fecha_denuncia, 
        descripcion_general, 
        lugar, 
        estado, 
        monto_reclamado, 
        tipo_bien, 
        identificador_bien, 
        datos_especificos // <-- Este es nuestro poderoso campo JSONB
    } = req.body;

    try {
        const nuevoSiniestro = await pool.query(
            `INSERT INTO siniestro 
            (id_poliza, fecha_ocurrencia, fecha_denuncia, descripcion_general, lugar, estado, monto_reclamado, tipo_bien, identificador_bien, datos_especificos) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [id_poliza, fecha_ocurrencia, fecha_denuncia, descripcion_general, lugar, estado, monto_reclamado, tipo_bien, identificador_bien, datos_especificos]
        );
        res.status(201).json(nuevoSiniestro.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar el siniestro' });
    }
};

// 3. Actualizar el estado y/o monto indemnizado de un siniestro
const actualizarEstadoSiniestro = async (req, res) => {
    const { id } = req.params;
    const { estado, monto_indemnizado } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE siniestro SET estado = $1, monto_indemnizado = $2 WHERE id_siniestro = $3 RETURNING *',
            [estado, monto_indemnizado, id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Siniestro no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el siniestro' });
    }
};

// 4. Eliminación Lógica
const eliminarSiniestro = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE siniestro SET is_active = false WHERE id_siniestro = $1 RETURNING *',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Siniestro no encontrado' });
        }
        res.json({ mensaje: 'Siniestro anulado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar siniestro' });
    }
};

module.exports = { getSiniestros, crearSiniestro, actualizarEstadoSiniestro, eliminarSiniestro };