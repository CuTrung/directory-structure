const { handleTalk } = require("./hello.controller");
const { checkLogin } = require("../../middlewares/auth.middleware");
const prefix = "/hello";

const func = (ioData, ioGlobal) => {
  ioData.use(checkLogin).on("connection", handleTalk);
};

module.exports = {
  prefix,
  func,
};
