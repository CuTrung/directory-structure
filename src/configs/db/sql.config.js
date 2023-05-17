const sql = {};

module.exports = {
    sql,
    connectMySQL: ({ host, user, password, database, ...option }) => {
        const mysql = require('mysql2/promise');
        sql.dbMySQL = mysql.createPool({
            host, user, password, database, ...option
        })
    },
    // connectMSSQL: async ({ host, user, password, database, ...option }) => {
    //     const mssql = require('mssql')
    //     return await mssql.connect({
    //         host, user, password, database, ...option
    //     }).then(pool => pool.request());
    // }
}