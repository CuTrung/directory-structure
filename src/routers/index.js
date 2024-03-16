const express = require("express");
const userRoute = require("../modules/user/user.route");
const router = express.Router();
router.get("", (req, res) => res.send("Welcome to ExpressJS project!"));

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
