const NotFoundResponse = require("../common/responses/not-found.response");
module.exports = {
  mergeResponse: (req, res, next) => {
    req.body = { ...req.body, ...req.params, ...req.query };
    return next();
  },
  pageNotFound: (req, res, next) => next(new NotFoundResponse()),
};
