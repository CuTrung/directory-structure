const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const ErrorResponse = require('../common/responses/error.response');
const RESPONSE_MSG = require('../common/const/responseMsg.const');

module.exports = (err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const errorParsed = {};
    err.errors.forEach((error) => {
      errorParsed[error.field.join('.')] = {
        [error.types.join('|')]: error.messages.join('.'),
      };
    });
    return next(new ErrorResponse(httpStatus.BAD_REQUEST, errorParsed, RESPONSE_MSG.VALIDATION_FAILED));
  } else if (!(err instanceof ErrorResponse)) {
    return next(new ErrorResponse(httpStatus.BAD_REQUEST, err.errors, err.message));
  }
  return next(err);
};
