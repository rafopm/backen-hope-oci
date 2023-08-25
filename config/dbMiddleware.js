const oracledb = require('oracledb');

let pool;

async function connectMiddleware(req, res, next) {
  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING,
      // otras configuraciones...
    });
  }

  try {
    req.db = await pool.getConnection();
    next();
  } catch (error) {
    console.error('Error al obtener la conexión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = connectMiddleware;
