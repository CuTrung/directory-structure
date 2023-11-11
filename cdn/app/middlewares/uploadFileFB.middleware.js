const util = require("util");
const multer = require("multer");
const appRoot = require("app-root-path");
const path = require("path");
const fileDir = path.normalize(`${appRoot}/storage/file/fb`);
const { v4: uuidv4 } = require("uuid");

const maxSize = 500 * 1024 * 1024;

let fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4().toString() + ext);
    },

});

let upload = multer({
    storage: fileStorage,
    limits: { fileSize: maxSize },
}).array("file");


let uploadMiddeware = util.promisify(upload);

module.exports = {
    uploadMiddeware,
};
