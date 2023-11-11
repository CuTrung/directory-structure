const db = {};
const DEFAULT_HOST = '127.0.0.1';

module.exports = {
    db,
    connectMySQL: ({ host = DEFAULT_HOST, user, password, database, ...options } = {}) => {
        try {
            const { createPool } = require('mysql2/promise');
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
            console.log('>>> Connect MySQL success');
        } catch (error) {
            console.log('>>> error', error);
        }
    },
    connectMSSQL: async ({
        server = DB_MSSQL_HOST ?? DEFAULT_HOST,
        user = DB_MSSQL_USER,
        password = DB_MSSQL_PASS,
        database = DB_MSSQL_NAME,
        port = parseInt(DB_MSSQL_PORT ?? 1433),
        ...options
    } = {}) => {
        try {
            const { ConnectionPool } = require('mssql');
            db.MSSQL = await new ConnectionPool({
                database,
                user,
                password,
                server,
                port,
                ...options,
            }).connect();
            console.log('>>> Connect MSSQL success');
        } catch (error) {
            console.log('>>> error', error);
        }
    },
    connectMongoDB: async ({ host = DEFAULT_HOST, user, password, database, ...options } = {}) => {
        try {
            const mongoose = require('mongoose');
            await mongoose.connect(`mongodb://${host}:27017/${database}`);
            db.mongoDB = mongoose;
            console.log('>>> Connect MongoDB success');
        } catch (error) {
            console.log('>>> error', error);
        }
    },
    connectRedis: async ({ host = DEFAULT_HOST, user = 'default', password, database, ...options } = {}) => {
        try {
            const Redis = require('ioredis');
            db.redis = new Redis({ host, user, ...options });
            console.log('>>> Connect Redis success');
        } catch (error) {
            console.log('>>> error', error);
        }
    },
};
