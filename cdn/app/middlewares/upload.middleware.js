const util = require("util");
const multer = require("multer");
const appRoot = require('app-root-path');
const { v4: uuidv4} = require('uuid');
const path = require('path');
const fileDir = path.normalize(`${appRoot}/storage/file`);

const maxSize = 5 * 1024 * 1024 * 1024 * 1024;

let storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, fileDir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4().toString()+'.jpeg');
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;