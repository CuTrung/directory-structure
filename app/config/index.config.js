require("./env.config")();
const { connectMSSQL, connectPostgreSQL } = require("./db.config");
// connectMSSQL({
//     pool: {
//         max: 10,
//         min: 1,
//         idleTimeoutMillis: 300000,
//     },
//     options: {
//         enableArithAbort: true,
//         requestTimeout: 3000000,
//     },
// });

// connectPostgreSQL({
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 20000,
// });

module.exports = {};
