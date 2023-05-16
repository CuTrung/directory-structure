const mysql = require('mysql2/promise');

let connection;
const connectDB = async () => {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

const execQuery = async (query, arrData) => {
    const [rows, fields] = await connection.execute(query, arrData);
    return [rows, fields];
}


module.exports = {
    connectDB, execQuery
}