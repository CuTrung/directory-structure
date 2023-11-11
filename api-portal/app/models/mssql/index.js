const config = require('../../../config/index.config').sql;
const sql = require('mssql');
const { MSSQL } = require('../../../config/db.config');

module.exports = {
    sql,
    pool: MSSQL,
};
