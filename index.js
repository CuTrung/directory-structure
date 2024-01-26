const expressApp = require("express")();
const init = require("./src/app");
const app = init(expressApp);

app.listen(PORT, () =>
  console.info(`API server started on port ${PORT} (${NODE_ENV})`),
);

exports.app = app;
