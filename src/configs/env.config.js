require("dotenv").config();
const { convertEnvToArray } = require("../common/utils/array.util");
const initConfigEnvs = () => {
  Object.assign(global, {
    ...process.env,
    PORT: process.env.PORT || 3000,
    APP_DIR_ROOT: __dirname.replace("configs", ""),
    WHITE_LIST: convertEnvToArray(process.env.WHITE_LIST),
  });
};
module.exports = { initConfigEnvs };
