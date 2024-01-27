const httpStatus = require("http-status");

const ErrorResponse = require("../common/responses/error.response");
const { verifyJWT } = require("../common/utils/token.util");
const prefix = "/api";
const ROUTERS_NOT_CHECK = [
  `${prefix}/auth/logout`,
];

const REGEX_ROUTERS_NOT_CHECK = ["/uploads/*", "/pdf*"];

const isNextRoute = (route = '') => {
  if (
    ROUTERS_NOT_CHECK.includes(route) ||
    REGEX_ROUTERS_NOT_CHECK.find(regex => new RegExp(regex).test(route))
  ) return true;
  return false;
}

module.exports = async (req, res, next) => {

  return next();
  const route = req.path;
  if (isNextRoute(route)) return next();

  // Get authorization header
  const { authorization } = req.headers;
  if (!(authorization && /^Bearer /.test(authorization)))
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null, "Token required"));

  const token = authorization.replace("Bearer ", "");
  const decoded = verifyJWT(token, JWT_PUBLIC_KEY);

  if (!decoded) return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null));

  if (decoded.expiredAt) return next(new ErrorResponse(httpStatus.UNAUTHORIZED, { expiredAt: decoded.expiredAt }, "Token expired"));

  req.body = { ...req.body, ...decoded };
  return next();
};
