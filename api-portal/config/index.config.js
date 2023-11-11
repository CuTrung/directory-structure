require('./env.config')();
const { connectMSSQL } = require('./db.config');
connectMSSQL({
    pool: {
        max: 10,
        min: 1,
        idleTimeoutMillis: 300000,
    },
    options: {
        enableArithAbort: true,
        requestTimeout: 3000000,
    },
});

module.exports = {};
