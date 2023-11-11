const util = require("util");
const multer = require("multer");
const appRoot = require("app-root-path");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fileDir = path.normalize(`${appRoot}/storage/file`);

const maxSizeVideo = 50 * 1024 * 1024;

let fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4().toString() + ext);
  },
});

const uploadFileFilter = (req, file, cb) => {
  if (
    file.mimetype == "video/mp4" ||
    file.mimetype == "video/3gpp" ||
    file.mimetype == "video/quicktime"||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"||
    file.mimetype == "application/pdf"||
    file.mimetype == "application/msword"||
    file.mimetype == "application/zip"||
    file.mimetype == "application/x-zip-compressed"||
    file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
    file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

  ) {
    cb(null, true);
  } else {
    return cb(new Error("Only .mp4, .avi and .mov .pdf .doc .docx .xlsx .png, .jpg and .jpeg .zip format allowed!"));
  }
};

let upload = multer({
  storage: fileStorage,
  limits: { fileSize: maxSizeVideo },
  //fileFilter: uploadFileFilter,
}).array("file");


let uploadMiddeware = util.promisify(upload);

module.exports = {
  uploadMiddeware,
};
