const httpStatus = require('http-status');
const BaseResponse = require('./base.response');

class NotFoundResponse extends BaseResponse {
    constructor() {
        super(null, httpStatus['404'], httpStatus.NOT_FOUND, null);
    }
}

module.exports = NotFoundResponse;
