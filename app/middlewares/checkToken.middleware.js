const httpStatus = require("http-status");

const ErrorResponse = require("../common/responses/error.response");
const { verifyJWT } = require("../common/utils/token.util");
const prefix = "/api";
const ROUTE_NOT_CHECK = [
  `${prefix}`,
  `${prefix}/auth/token`,
  `${prefix}/auth/refresh-token`,
  `${prefix}/auth/logout`,
];

const REGEX_ROUTE_NOT_CHECK = ["/uploads/*", "/pdf*"];

module.exports = async (req, res, next) => {
  const path = req.path;

  // Exclude routes don't need check
  if (ROUTE_NOT_CHECK.includes(path)) return next();

  // Exclude regex routes don't need check
  for (const regex of REGEX_ROUTE_NOT_CHECK) {
    if (new RegExp(regex).test(path)) return next();
  }

  // Get authorization header
  const { authorization } = req.headers;
  if (!(authorization && /^Bearer /.test(authorization)))
    return next(
      new ErrorResponse(
        httpStatus.UNAUTHORIZED,
        "",
        'Token required',
      ),
    );

  const token = authorization.replace("Bearer ", "");
  const decoded = verifyJWT(token, JWT_PUBLIC_KEY);

  if (!decoded) return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null));

  req.body = { ...req.body, ...decoded };
  return next();
};
