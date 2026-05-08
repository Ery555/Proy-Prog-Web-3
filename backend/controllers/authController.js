const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función auxiliar para medir la fuerza (Lógica para el Punto 10)
const calcularFuerzaPassword = (password) => {
    const tieneLetras = /[a-zA-Z]/.test(password);
    const tieneNumeros = /\d/.test(password);
    const tieneSimbolos = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length >= 12 && tieneLetras && tieneNumeros && tieneSimbolos) {
        return "Fuerte";
    } else if (password.length >= 8 && tieneLetras && tieneNumeros) {
        return "Intermedia";
    } else {
        return "Débil";
    }
};

const registrarUsuario = async (req, res) => {
    const { nombre, email, password, rol, item } = req.body;

    try {
        // 1. Validar nivel de contraseña (Punto 10)
        const nivelSeguridad = calcularFuerzaPassword(password);

        // Opcional: Podrías bloquear el registro si es Débil
        if (nivelSeguridad === "Débil") {
            return res.status(400).json({
                mensaje: 'La contraseña es muy débil. Debe tener al menos 8 caracteres y combinar letras y números.'
            });
        }

        // 2. Verificar si el usuario ya existe
        const usuarioExiste = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (usuarioExiste.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
        }

        // 3. Encriptar
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // 4. Guardar
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuario (nombre, email, password, rol, item) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, email, rol',
            [nombre, email, passwordEncriptada, rol, item]
        );

        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            nivelSeguridad, // Le avisamos al usuario qué nivel tiene su clave
            usuario: nuevoUsuario.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor al registrar' });
    }
};

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol }, // Lo que queremos que el token "sepa"
            process.env.JWT_SECRET,               // Nuestra llave secreta del .env
            { expiresIn: '8h' }                   // El token expira en 8 horas
        );

        // Registro de LOG (Punto 11)
        const ip = req.ip || req.connection.remoteAddress;
        const browser = req.headers['user-agent'];
        await pool.query(
            'INSERT INTO log_acceso (id_usuario, evento, ip_address, browser) VALUES ($1, $2, $3, $4)',
            [usuario.id_usuario, 'Ingreso', ip, browser]
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token, // <--- Enviamos el token pase al frontend
            usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
const getAsesores = async (req, res) => {
    try {
        const result = await pool.query('SELECT id_usuario, nombre, email, rol FROM usuario WHERE is_active = true');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener asesores' });
    }
};

module.exports = { registrarUsuario, loginUsuario, getAsesores };