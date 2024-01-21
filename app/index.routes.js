const express = require("express");
const path = require("path");
const requireContext = require("require-context");
const router = express.Router();
router.get("/", (req, res) => res.send(APP_WELCOME));
try {
  const allRoutes = requireContext(
    path.join(__dirname, "./modules"),
    true,
    /\.route\.js$/,
  );
  allRoutes.keys().forEach((route) => {
    const curRoute = require("./modules/" + route);
    router.use(curRoute.prefix, curRoute.routes);
  });
} catch (error) {
  console.log(">>> init route error", error);
}

module.exports = router;
