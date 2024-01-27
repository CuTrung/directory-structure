const connectMySQL = ({
  host = DEFAULT_DB_HOST,
  user,
  password,
  database,
  ...options
} = {}) => {
  try {
    const { createPool } = require("mysql2/promise");
    db.mySQL = createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      ...options,
    });
    console.log(">>> Connect MySQL success");
  } catch (error) {
    console.log(">>> error", error);
  }
};
module.exports = { connectMySQL };
