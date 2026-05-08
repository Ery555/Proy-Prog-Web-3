const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Buscamos el token en los headers de la petición
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
    }

    try {
        // El token suele venir como "Bearer <token>", así que lo limpiamos
        const soloToken = token.split(' ')[1]; 
        
        // Verificamos si el token es válido y no ha expirado
        const cifrado = jwt.verify(soloToken, process.env.JWT_SECRET);
        
        // Guardamos los datos del usuario dentro de la petición para usarlo después
        req.usuario = cifrado; 
        
        next(); // ¡Todo bien! Pasa a la siguiente función
    } catch (error) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
};

module.exports = { verificarToken };