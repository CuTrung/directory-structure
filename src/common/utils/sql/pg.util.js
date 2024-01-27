let pg;
const { Pool } = require("pg");
const connectPG = async ({
  host = DB_PG_HOST ?? DEFAULT_DB_HOST,
  user = DB_PG_USER ?? "postgres",
  password = DB_PG_PASS,
  database = DB_PG_NAME,
  port = DB_PG_PORT,
  ...options
} = {}) => {
  try {
    const pool = new Pool({
      user,
      host,
      database,
      password,
      port,
      ...options,
    });
    pg = await pool.connect();
    console.log(">>> Connect PostgreSQL success");
  } catch (error) {
    console.log(">>> error", error);
  }
};

const execQuery = async (query) => {
  try {
    const data = await pg.query(query);
    return data;
  } catch (error) {
    console.log(`>>> ~ execQuery ~ error:`, error);
  }
};

module.exports = { connectPG, pg, execQuery };
