const fs = require("fs");
const { mkdirp } = require("mkdirp");
const appRoot = APP_DIR_ROOT;
const logger = require("../classes/logger.class");
const path = require("path");
const folderUploadName = "uploads";
const base64 = require("is-base64");
const axios = require("axios");
const FormData = require("form-data");
const config = require("../../../config/index.config");

const readFileAsString = (path) => {
  try {
    return fs.readFileSync(path, { encoding: "utf8" });
  } catch (e) {
    logger.error(e, { function: "fileHelper.readFileAsString" });
  }
  return "";
};

const uploadFormData = (base64) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("type", "default");
    form.append("file", Buffer.from(base64.split(";base64,").pop(), "base64"), {
      filename: "document.png",
    });
    axios
      .post(`${config.domain_cdn}/upload`, form, {
        headers: {
          ...form.getHeaders(),
          ...{ Authorization: `APIKEY ${config.upload_apikey}` },
        },
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};

const saveTmpBase64File = (pathFile, base64) => {
  try {
    const base64data = base64.split(";base64,").pop();
    fs.writeFileSync(pathFile, base64data, { encoding: "base64" });
    return pathFile;
  } catch (e) {
    return null;
  }
};

const getPathStorage = () => {
  return `${appRoot}/storage`;
};

const getPathUpload = () => {
  return getPathStorage() + `/${folderUploadName}`;
};

/**
 * Save base64 to file
 *
 * @param folderPath
 * @param base64
 * @param fileName
 * @returns {Promise<*>}
 */
const saveBase64 = async (folderPath, base64, fileName) => {
  try {
    const res = await uploadFormData(base64);
    return res.data && res.data.file ? res.data.file : null;
  } catch (e) {
    logger.error(e, { function: "fileHelper.saveBase64" });
    return null;
  }
};

const getExtensionFromBase64 = (base64, extentions) => {
  if (!extentions || extentions.length === 0)
    extentions = [
      ".jpeg",
      ".jpg",
      ".png",
      ".gif",
      ".xls",
      ".xlsx",
      ".ods",
      ".mp3",
      ".mp4",
      ".doc",
      ".docx",
      ".odt",
      ".pdf",
      ".txt",
      ".ppt",
      ".pptx",
    ];
  const extention = base64.substring(
    base64.indexOf("/") + 1,
    base64.indexOf(";base64"),
  );
  if (extentions.includes("." + extention)) return extention;
  return null;
};

function isBase64(data) {
  // return base64(data, { allowEmpty: false, allowMime: true });
  if (!data) return false;
  return (
    data.indexOf("data:image/jpg;base64") != -1 ||
    data.indexOf("data:image/png;base64") != -1 ||
    data.indexOf("data:image/jpeg;base64") != -1
  );
}

const getExtensionFromFileName = (fileName, extentions) => {
  if (!extentions || extentions.length === 0)
    extentions = [
      ".jpeg",
      ".jpg",
      ".png",
      ".gif",
      ".xls",
      ".xlsx",
      ".ods",
      ".mp3",
      ".mp4",
      ".doc",
      ".docx",
      ".odt",
      ".pdf",
      ".txt",
      ".ppt",
      ".pptx",
      ".jfif",
    ];
  var arrName = fileName.split(".");
  const extention = arrName.length > 1 ? arrName[arrName.length - 1] : "";
  if (extentions.includes("." + extention)) return extention;
  return null;
};

const createGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const saveFile = async (base64, folderName) => {
  let url = null;
  try {
    if (isBase64(base64)) {
      const extension = getExtensionFromBase64(base64);
      const guid = createGuid();
      url = await saveBase64(folderName, base64, `${guid}.${extension}`);
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      function: "file.util.saveFile",
    });
  }
  return url;
};

const saveVideo = async (video) => {
  try {
    const res = await uploadVideo(video instanceof Array ? video[0] : video);
    if (!res.data) throw new Error(res.message);
    return res.data && res.data.file ? res.data.file : null;
  } catch (e) {
    logger.error(e.message || e, { function: "fileHelper.video" });
    throw new Error(e.message || "error");
  }
};

const uploadVideo = (file) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("video", file.buffer, { filename: file.originalname });
    axios
      .post(`${config.domain_cdn}/upload/video`, form, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          ...form.getHeaders(),
          ...{ Authorization: `APIKEY ${config.upload_apikey}` },
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        let { response } = err;
        if (!response) {
          throw err;
        }
        const { data } = response;
        reject(data.message || "Lỗi upload video!");
      });
  });
};

function isImageBase64(data) {
  if (!data) return false;
  return (
    data.indexOf("data:image/jpg;base64") != -1 ||
    data.indexOf("data:image/png;base64") != -1 ||
    data.indexOf("data:image/jpeg;base64") != -1
  );
}

const saveImage = async (base64) => {
  let url = null;
  try {
    if (isImageBase64(base64)) {
      // url = await saveBase64(null, base64, null);
      const base64data = base64.split(";base64,").pop();
      const fileName = `${createGuid()}.jpg`;
      const pathFile = `${appRoot}/storage/file/${fileName}`;
      fs.writeFileSync(pathFile, base64data, { encoding: "base64" });
      return `/file/${fileName}`;
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      function: "file.util.saveImage",
    });
  }
  return url;
};

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file.buffer, { filename: file.originalname });

    axios
      .post(`${config.domain_cdn}/upload`, form, {
        headers: {
          ...form.getHeaders(),
          ...{ Authorization: `APIKEY ${config.upload_apikey}` },
        },
        maxContentLength: 200000000,
        maxBodyLength: 200000000,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        logger.error(err, {
          function: "file.util.uploadFile",
        });
        let { response } = err;
        const { statusText } = response;
        reject({ message: statusText });
      });
  });
};

const saveLocal = async (folderPath, base64, fileName) => {
  try {
    let pathFolder = getPathUpload() + `/${folderPath}`;
    pathFolder = path.normalize(pathFolder);

    // Check folder exists
    if (!fs.existsSync(pathFolder)) {
      await mkdirp(pathFolder);
    }

    let pathFile = `${pathFolder}/${fileName}`;
    pathFile = path.normalize(pathFile);

    // save file
    saveTmpBase64File(pathFile, base64);

    return path.normalize(`/${folderUploadName}/${folderPath}/${fileName}`);
  } catch (e) {
    logger.error(e, { function: "fileHelper.saveBase64" });

    return null;
  }
};

const saveFileV2 = async (file, folderName) => {
  let url = null;
  try {
    const res = await uploadFilev2(file instanceof Array ? file[0] : file);
    if (!res.data) throw new Error(res.message);
    if (res.data instanceof Array && res.data.length && res.data[0].file)
      return res.data[0].file;
    return res.data && res.data.file ? res.data.file : null;
  } catch (e) {
    logger.error(e, {
      function: "file.util.saveFile",
    });
  }
  return url;
};

const uploadFilev2 = (
  file,
  url = `${config.domain_cdn}/upload/file`,
  file_name = null,
) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file.buffer, { filename: file.originalname });
    if (file_name) {
      form.append("file_name", file_name);
    }
    axios
      .post(url, form, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          ...form.getHeaders(),
          ...{ Authorization: `APIKEY ${config.upload_apikey}` },
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        let { response } = err;
        if (!response) {
          throw err;
        }
        const { data } = response;
        reject(data.message);
      });
  });
};

const createDirectory = async (directoryName) => {
  const logDir = path.normalize(`${appRoot}/${directoryName}`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
};

module.exports = {
  createGuid,
  readFileAsString,
  saveBase64,
  getExtensionFromBase64,
  isBase64,
  getExtensionFromFileName,
  saveFile,
  saveImage,
  saveVideo,
  uploadFile,
  saveLocal,
  saveFileV2,
  createDirectory,
};
