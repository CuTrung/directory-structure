const BaseResponse = require("./base.response");

class MessageResponse extends BaseResponse {
    /**
     * Creates an API Message Response.
     * @param {string} message - Response message.
     */
    constructor(message = "") {
        super(null, message);
    }
}

module.exports = MessageResponse;
