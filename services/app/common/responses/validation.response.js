const httpStatus = require('http-status');
const BaseResponse = require('./base.response');

class ValidationResponse extends BaseResponse {
    /**
     * Creates an API Message Response.
     * @param {object} errors - Error messages.
     */
    constructor(field, message) {
        super(null, 'Lỗi', httpStatus.UNPROCESSABLE_ENTITY, [
            {
                'field': field,
                'messages': [`${field} ${message}`],
            },
        ]);
    }
}

module.exports = ValidationResponse;
