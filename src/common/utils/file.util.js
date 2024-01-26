const fs = require("fs");
const path = require("path");
const createDirectory = (directoryName) => {
  const logDir = path.normalize(`${APP_DIR_ROOT}/${directoryName}`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  return logDir;
};

module.exports = {
  createDirectory,
};
