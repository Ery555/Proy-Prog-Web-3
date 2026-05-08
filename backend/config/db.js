const { Pool } = require('pg');
require('dotenv').config();

// Configuramos la conexión usando las variables del .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Probamos la conexión una sola vez al iniciar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo el cliente', err.stack);
  }
  console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
  release();
});

module.exports = pool;