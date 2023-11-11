const config = require('../../../config/config').sql;
const sql = require('mssql');

const pool = new sql.ConnectionPool(config)
  .connect()
  .then((poolConnect) => {
    console.log('Connected to MSSQL');
    return poolConnect;
  })
  .catch((err) => { console.log(config); console.log('Database Connection Failed! Bad Config: ', err); });

module.exports = {
  sql, pool,
};
