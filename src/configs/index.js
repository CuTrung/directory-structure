const { initConfigEnvs } = require("./env.config");
initConfigEnvs();
const { connectPG } = require("../common/utils/sql/pg.util");
// (async () => {
//   await connectPG({
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 20000,
//   });
// })();

module.exports = {};
