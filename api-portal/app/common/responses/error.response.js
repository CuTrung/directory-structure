const httpStatus = require('http-status');
const BaseResponse = require('./base.response');

class ErrorResponse extends BaseResponse {
    /**
     * Creates an API Message Response.
     * @param {number} status - HTTP status code.
     * @param {object} errors - Error messages.
     * @param {string} message - Error descriptive message.
     */
    constructor(status, errors = {}, message = '') {
        if (!status) {
            status = httpStatus.BAD_REQUEST;
        }
        super(null, message, status, errors);
    }
}

module.exports = ErrorResponse;
