const express = require("express");
const userRoute = require("../modules/user/user.route");
const router = express.Router();
const routers = {
  ...userRoute,
};

const initRouters = () => {
  for (const prefix of Object.keys(routers)) {
    router.use(prefix, routers[prefix]);
  }
  return router;
};

module.exports = initRouters();
