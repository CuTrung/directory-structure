const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
require("./config/index.config");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const useragent = require("express-useragent");
const express = require("express");
const path = require("path");
const fs = require("fs");
require("util").inspect.defaultOptions.depth = null;
const ev = require("express-validation");
const compression = require("compression");
const routes = require("./index.routes");
const {
  mergeResponse,
  pageNotFound,
} = require("./middlewares/utils.middleware");
// assign options
ev.options({
  status: 422,
  statusText: "Unprocessable Entity",
});

const init = (app) => {
  // parse body params and attache them to req.body
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  // secure apps by setting various HTTP headers
  app.use(helmet());

  // Reduce data response to frontend
  app.use(compression());

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // parse information user agent
  app.use(useragent.express());

  const logDir = path.normalize(`${APP_DIR_ROOT}/storage`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  app.use(express.static(`${APP_DIR_ROOT}/storage`, { index: false }));

  app.use(mergeResponse);

  // parse validation error nicely
  if (NODE_ENV !== "testing") {
    app.use(require("./middlewares/checkToken.middleware"));
    const logger = require("morgan");
    app.use(logger(NODE_ENV === "develop" ? "dev" : "combined"));
  }

  // mount all routes on /api path
  app.use("/api", routes);

  // catch 404 and forward to error handler
  app.use(pageNotFound);

  // error handler
  app.use(errorHandler);

  // Use socket in project
  // app = require('./socket/app.socket')(app);

  return app;
};

module.exports = init;
