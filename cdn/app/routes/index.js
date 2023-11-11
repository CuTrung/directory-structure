const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");
const fileController = require("../controllers/file-new.controller");
const fileFBController = require('../controllers/fileFB.controller')

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.post("/upload/file", fileController.uploadFile)
  router.post("/upload/file-manager", fileController.uploadFileManager)
  router.post("/upload/file-facebook", fileFBController.uploadFile)
  app.use(router);
};

module.exports = routes;