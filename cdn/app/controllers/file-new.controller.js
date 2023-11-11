const upload = require("../middlewares/uploadFile.middleware");

const uploadV2 = require("../middlewares/uploadFileManager.middleware");

const imageConst = require("../common/const/image.const");
const appRoot = require("app-root-path");
const Resize = require("../common/helpers/resize.helper");
const ErrorResponse = require("../common/responses/error.response");
const SingleResponse = require("../common/responses/single.response");
const httpStatus = require("http-status");
const path = require("path");

const uploadFile = async (req, res, next) => {
    try {
        await upload.uploadMiddeware(req, res);
        let data = [];
        for (let index = 0; index < (req.files || []).length; index++) {
            const element = req.files[index];
            if (element == undefined) {
                return next(
                    new ErrorResponse(
                        httpStatus.BAD_REQUEST,
                        null,
                        "Please upload a file!"
                    )
                );
            }
            // resize image
            let filename = element.filename;

            if (req.body.type && req.body.type !== "default") {
                const imagePath = path.normalize(`${appRoot}/storage/file`);
                const fileUpload = new Resize(
                    imagePath,
                    imageConst["size"][req.body.type]
                );
                filename = await fileUpload.save(element.path);
                data.push({
                    file: `/file/${filename}`,
                    fileName: element.originalname,
                });
            }
            data.push({ file: `/file/${filename}`, fileName: element.originalname });
        }
        next(new SingleResponse(data, "Uploaded the file successfully"));
    } catch (err) {
        console.log(err)
        if (err.code == "LIMIT_FILE_SIZE") {
            return next(
                new ErrorResponse(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    err,
                    "File size cannot be larger than 2MB!"
                )
            );
        }

        return next(
            new ErrorResponse(
                httpStatus.INTERNAL_SERVER_ERROR,
                err,
                "Could not upload file"
            )
        );
    }
};


const uploadFileManager = async (req, res, next) => {
    try {
        await uploadV2.uploadMiddeware(req, res);
        let data = [];
        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            if (element == undefined) {
                return next(
                    new ErrorResponse(
                        httpStatus.BAD_REQUEST,
                        null,
                        "Please upload a file!"
                    )
                );
            }
            // resize image
            let filename = element.filename;

            if (req.body.type && req.body.type !== "default") {
                const imagePath = path.normalize(`${appRoot}/storage/fm`);
                const fileUpload = new Resize(
                    imagePath,
                    imageConst["size"][req.body.type]
                );
                filename = await fileUpload.save(element.path);
                data.push({
                    file: `/fm/${filename}`,
                    fileName: element.originalname,
                });
            }
            data.push({ file: `/fm/${filename}`, fileName: element.originalname });
        }
        next(new SingleResponse(data, "Uploaded the file successfully"));
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return next(
                new ErrorResponse(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    err,
                    "File size cannot be larger than 2MB!"
                )
            );
        }

        return next(
            new ErrorResponse(
                httpStatus.INTERNAL_SERVER_ERROR,
                err,
                "Could not upload file"
            )
        );
    }
};


const uploadFileFacebook = async (req, res, next) => {
    try {
        await upload.uploadMiddeware(req, res);
        let data = [];
        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            if (element == undefined) {
                return next(
                    new ErrorResponse(
                        httpStatus.BAD_REQUEST,
                        null,
                        "Please upload a file!"
                    )
                );
            }
            // resize image
            let filename = element.filename;

            if (req.body.type && req.body.type !== "default") {
                const imagePath = path.normalize(`${appRoot}/storage/file`);
                const fileUpload = new Resize(
                    imagePath,
                    imageConst["size"][req.body.type]
                );
                filename = await fileUpload.save(element.path);
                data.push({
                    file: `/file/${filename}`,
                    fileName: element.originalname,
                });
            }
            data.push({ file: `/file/${filename}`, fileName: element.originalname });
        }
        next(new SingleResponse(data, "Uploaded the file successfully"));
    } catch (err) {
        console.log(err);
        if (err.code == "LIMIT_FILE_SIZE") {
            return next(
                new ErrorResponse(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    err,
                    "File size cannot be larger than 2MB!"
                )
            );
        }

        return next(
            new ErrorResponse(
                httpStatus.INTERNAL_SERVER_ERROR,
                err,
                "Could not upload file"
            )
        );
    }
};


module.exports = {
    uploadFile,
    uploadFileManager,
    uploadFileFacebook,
};
