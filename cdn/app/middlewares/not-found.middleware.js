const NotFoundResponse = require('../common/responses/not-found.response');

module.exports = function () {
  return function (req, res, next) {
    next(new NotFoundResponse());
  };
};
