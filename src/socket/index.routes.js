const path = require("path");
const requireContext = require("require-context");
const { checkAuth } = require("./middlewares/auth.middleware");

module.exports = function initRoutes(io) {
  if (!(NODE_ENV === "test")) {
    try {
      io.of(/.*/).use(checkAuth);

      const defaultPrefix = "/socket";
      const allRoutes = requireContext(
        path.join(__dirname, "./modules"),
        true,
        /\.route\.js$/,
      );
      allRoutes.keys().forEach((route) => {
        const curRoute = require("./modules/" + route);
        curRoute.func(io.of(`${defaultPrefix}${curRoute.prefix}`), io);
      });
    } catch (error) {
      console.log(">>> init route error", error);
    }
  }
};
