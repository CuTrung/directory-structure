const logger = require("../logger.util");
const sql = require("mssql");
const { db } = require("../../configs/db.config");
const { DB_TYPES } = require("../../const/db.const");

const connectMSSQL = async ({
  server = DB_MSSQL_HOST ?? DEFAULT_DB_HOST,
  user = DB_MSSQL_USER,
  password = DB_MSSQL_PASS,
  database = DB_MSSQL_NAME,
  port = parseInt(DB_MSSQL_PORT ?? 1433),
  ...options
} = {}) => {
  try {
    const { ConnectionPool } = require("mssql");
    db.MSSQL = await new ConnectionPool({
      database,
      user,
      password,
      server,
      port,
      ...options,
    }).connect();
    console.log(">>> Connect MSSQL success");
  } catch (error) {
    console.log(">>> error", error);
  }
};

const transaction = async (callback) => {
  const trans = new sql.Transaction(db.mssql);
  let data = null;
  try {
    await trans.begin();
    const reqTrans = new sql.Request(trans);
    data = await callback(reqTrans)
      .then((res) => {
        trans.commit();
        return res;
      })
      .catch((err) => {
        trans.rollback();
        return err;
      });
  } catch (error) {
    console.log(">>> error", error);
    await trans.rollback();
    logger.error(error, { Task: "db.util.transaction" });
  }

  return data;
};

const execProc = async (procedureName, data = {}, reqTrans) => {
  const totalFields = Object.keys(data);
  const req = reqTrans ?? db.mssql.request();
  req.parameters = [];
  if (totalFields.length > 0) {
    for (const field of totalFields) {
      req.input(field, data[field]);
    }
  }
  return await req.execute(procedureName);
};

module.exports = {
  transaction,
  execProc,
  connectMSSQL,
};
