const util = require("util");
const multer = require("multer");
const appRoot = require("app-root-path");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fileDir = path.normalize(`${appRoot}/storage/fm`);

const maxSizeVideo = 4 * 1024 * 1024 * 1024;

let fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); 
        cb(null, uuidv4().toString() + ext);
    },
});

// const uploadFileFilter = (req, file, cb) => {
//   if (
//     file.mimetype == "video/mp4" ||
//     file.mimetype == "video/3gpp" ||
//     file.mimetype == "video/quicktime"||
//     file.mimetype == "image/png" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/jpeg"||
//     file.mimetype == "application/pdf"||
//     file.mimetype == "application/msword"||
//     file.mimetype == "application/zip"||
//     file.mimetype == "application/x-zip-compressed"||
//     // .psd
//     file.mimetype == "application/x-photoshop"||
//     file.mimetype == "application/octet-stream"||
//     file.mimetype == "image/vnd.adobe.photoshop"||
//     // .ai
//     file.mimetype == "application/postscript"||

//     //.xml
//     file.mimetype == "application/xml"||
//     file.mimetype == "text/xml"||
//     file.mimetype == "image/svg+xml"||

//     //.rp
//     file.mimetype == "image/vnd.rn-realpix"||

//     //.xmind
//     file.mimetype == "application/x-xmind"||

//     //svg
//     file.mimetype == "image/svg+xml"||

//     //.stl
//     file.mimetype == "model/stl"||
//     file.mimetype == "model/x.stl-ascii"||
//     file.mimetype == "model/x.stl-binary"||
//     // .glb
//     file.mimetype == "model/gltf-binary"||
//     file.mimetype == "model/gltf+json"||
//     // .3dm
//     file.mimetype == "x-world/x-3dmf"||
//     file.mimetype == "application/vnd.ms-excel"||
//     file.mimetype == "application/vnd.ms-powerpoint"||
//     file.mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation"||
//     file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
//     file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // '','application/octet-stream','image/vnd.adobe.photoshop'

//   ) {
//     cb(null, true);
//   } else {
//     return cb(new Error("Only .mp4, .avi and .mov .ppt .psd .ai .xml .rp .xmind .stl .glb .3dm  .pptx  .pdf .doc .docx .xlsx .png, .jpg and .jpeg .zip format allowed!"));
//   }
// };

let upload = multer({
  storage: fileStorage,
  limits: { fileSize: maxSizeVideo },
//   fileFilter: uploadFileFilter,
}).array("file");


let uploadMiddeware = util.promisify(upload);

module.exports = {
    uploadMiddeware,
};
