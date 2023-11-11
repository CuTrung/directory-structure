const upload = require("../middlewares/uploadFileFB.middleware");
const appRoot = require("app-root-path");
const path = require("path");
const fileDir = path.normalize(`${appRoot}/storage/file/fb`);
const ErrorResponse = require("../common/responses/error.response");
const SingleResponse = require("../common/responses/single.response");
const httpStatus = require("http-status");
const fs = require("fs");
const stringHelper = require('../common/helpers/string.helper');

const uploadFile = async (req, res, next) => {
    try {
        await upload.uploadMiddeware(req, res);
        let data = [];
  
        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            if (element == undefined) {
                return next(
                    new ErrorResponse(
                        400,
                        null,
                        "Please upload a file!"
                    )
                );
            }
            // resize image
            let filename = element.filename;
            const ext = path.extname(filename);
            let newFileName = req.body.file_name ? `${stringHelper.removeVietnameseTones(req.body.file_name)}${ext}` : filename;
            if(filename != newFileName) {
                await fs.renameSync(`${fileDir}/${filename}`, `${fileDir}/${newFileName}`)
            }
            data.push({ file: `/file/fb/${newFileName}`, fileName: element.originalname });
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

module.exports = {
    uploadFile
};
