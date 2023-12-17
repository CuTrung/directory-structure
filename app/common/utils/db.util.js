const logger = require("../classes/logger.class");
const sql = require("mssql");
const { db } = require("../../config/db.config");

const transaction = async (callback) => {
  const trans = new sql.Transaction(db.MSSQL);
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

const execProcedure = async (procedureName, data = {}, reqTrans) => {
  const totalFields = Object.keys(data);
  const req = reqTrans ?? db.MSSQL.request();
  if (totalFields.length > 0) {
    for (const field of totalFields) {
      req.input(field, data[field]);
    }
  }
  return await req.execute(procedureName);
};

module.exports = {
  transaction,
  execProcedure,
};
