const httpStatus = require("http-status");

class BaseResponse {
  /**
   * Creates an API Base.
   * @param {object} data - Data Object.
   * @param {string} message - Response message.
   * @param {number} status - HTTP status code.
   * @param {object} errors - Errors if any.
   */
  constructor(
    data = null,
    message = "",
    status = httpStatus.OK,
    errors = null,
  ) {
    this.data = data;
    this.message = message;
    this.status = status;
    this.errors = errors;
  }
}

module.exports = BaseResponse;
