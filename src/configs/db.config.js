const db = {};
const DEFAULT_HOST = '127.0.0.1'
module.exports = {
    db,
    connectMySQL: ({
        host = DEFAULT_HOST,
        user,
        password,
        database,
        ...option
    }) => {
        try {
            const { createPool } = require('mysql2/promise');
            db.mySQL = createPool({
                host, user, password, database, ...option
            })
            console.log(">>> Connect MySQL success");
        } catch (error) {
            console.log(">>> ~ file: sql.config.js:12 ~ error: ", error)
        }
    },
    connectMongoDB: async ({
        host = DEFAULT_HOST,
        user,
        password,
        database,
        ...option
    }) => {
        const mongoose = require('mongoose');
        try {
            await mongoose.connect(`mongodb://${host}:27017/${database}`);
            db.mongoDB = mongoose;
            console.log(">>> Connect MongoDB success");
        } catch (error) {
            console.log(">>> ~ file: db.config.js:26 ~ error: ", error)
        }
    },
    connectRedis: async ({
        host = DEFAULT_HOST,
        user = "default",
        password,
        database,
        ...option
    }) => {
        try {
            const Redis = require("ioredis");
            db.redis = new Redis({ host, user });
            console.log(">>> Connect Redis success");
        } catch (error) {
            console.log(">>> ~ file: db.config.js:55 ~ error: ", error)
        }
    }
}