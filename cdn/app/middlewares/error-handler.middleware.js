const httpStatus = require('http-status');

function logError(error, req) {
  let errorName = '';
  let errorContent = '';

  switch (typeof error) {
    case 'string':
      errorName = error;
      errorContent = error;
      break;
    case 'object':
      errorName = error.constructor.name;
      errorContent = error.message;
      break;
  }
}

module.exports = function () {
  return function (error, req, res, next) {
    // Write log system
    logError(error, req);

    // Error is object
    if(error instanceof Object) {
      switch (error.constructor.name) {
        case 'NotFoundResponse':
        case 'ErrorResponse':
          return res.status(error.status).json(error);
        case 'ServiceResponse':
          error.status = httpStatus.BAD_REQUEST;
          return res.status(error.status).json({
            status: error.getStatus(),
            message: error.getMessage(),
            data: error.getData(),
            errors: error.getErrors(),
          });
        case 'Error':
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            errors: error.errors || null,
          });
        default:
          if(! error.message) {
            error.message = 'Our app has encountered an unforeseen issue. We will have this addressed shortly.';
          }
          if(! error.status) {
            error.status = httpStatus.BAD_REQUEST;
          }
          return res.status(error.status).json(error);
      }
    }
    // Error is string
    else if(typeof(error) === 'string' || error instanceof String) {
      return res.status(httpStatus.BAD_REQUEST).json({
        'message': error,
        'status': httpStatus.BAD_REQUEST,
      });
    }

    // Error unknown
    return res.status(error.status || httpStatus.BAD_REQUEST).json(error);
  };
};
