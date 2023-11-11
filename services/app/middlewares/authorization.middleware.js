const httpStatus = require('http-status');
const ErrorResponse = require('../common/responses/error.response');
const ROLE = require('../common/const/role.const');

const requireRoles = (role = ROLE.GUEST) => ((req, res, next) => {
  if (!req.auth || req.auth.role < role) {
    const err = new ErrorResponse(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    return res.status(err.status).json(err);
  }
  return next();
});

module.exports = requireRoles;
