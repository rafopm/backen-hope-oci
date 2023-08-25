const oracledb = require("oracledb");
require('dotenv').config();
class Database {
  static async init() {
    console.log("Creando pool de conexiones...");
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING,
    });
    console.log("Pool de conexiones creado.");
    
  }

  static async close() {
    console.log("Cerrando conexion...");
    try {
      await oracledb.getPool().close(10);
      console.log("Pool cerrado");
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Database;
