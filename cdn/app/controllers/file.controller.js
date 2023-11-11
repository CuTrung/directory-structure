const uploadFile = require("../middlewares/upload.middleware");
const imageConst = require('../common/const/image.const');
const appRoot = require('app-root-path');
const Resize = require('../common/helpers/resize.helper');
const ErrorResponse = require('../common/responses/error.response');
const SingleResponse = require('../common/responses/single.response');
const httpStatus = require("http-status");
const path = require('path');

const upload = async (req, res, next) => {
    console.log(`run upload here`);
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, "Please upload a file!"))
        }
        // resize image
        let filename = req.file.filename;
        if (req.body.type && req.body.type !== 'default') {
            const imagePath = path.normalize(`${appRoot}/storage/file`);
            const fileUpload = new Resize(imagePath, imageConst['size'][req.body.type]);
            filename = await fileUpload.save(req.file.path);
        }
        next(new SingleResponse({ file: `/file/${filename}` }, 'Uploaded the file successfully'))
    } catch (err) {
        console.log({ err })
        if (err.code == "LIMIT_FILE_SIZE") {
            return next(new SingleResponse(false, "File size cannot be larger than 2MB!", ""))
        }
        return next(new SingleResponse(false, "Could not upload file", ""));
    }
};

module.exports = {
    upload
};