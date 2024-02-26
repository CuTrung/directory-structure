require("./configs");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const useragent = require("express-useragent");
const express = require("express");
require("util").inspect.defaultOptions.depth = null;
const ev = require("express-validation");
const compression = require("compression");
const {
  mergeResponse,
  pageNotFound,
} = require("./middlewares/utils.middleware");
const { createDirectory } = require("./common/utils/file.util");
// assign options
ev.options({
  status: 422,
  statusText: "Unprocessable Entity",
});

const init = (app) => {
  // parse body params and attache them to req.body
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));
  // secure apps by setting various HTTP headers
  app.use(helmet());

  // Reduce data response to frontend
  app.use(compression());

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // parse information user agent
  app.use(useragent.express());

  const staticPath = createDirectory("storage");
  app.use(express.static(staticPath, { index: false }));

  app.use(mergeResponse);

  const isDevelop = NODE_ENV === "develop";

  app.use(logger(isDevelop ? "dev" : "combined"));

  // parse validation error nicely
  if (!isDevelop) {
    app.use(require("./middlewares/checkToken.middleware"));
  }

  // mount all routes on /api path
  app.use("/api", require("./routers"));

  // catch 404 and forward to error handler
  app.use(pageNotFound);

  // error handler
  app.use(errorHandler);

  // Use socket in project
  // app = require('./socket/app.socket')(app);

  return app;
};

module.exports = init;
