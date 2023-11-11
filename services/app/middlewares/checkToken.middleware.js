const RESPONSE_MSG = require('../common/const/responseMsg.const');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../../config/config');
const userServices = require('../modules/user/user.service');
const ErrorResponse = require('../common/responses/error.response');
const prefix = '/api';
const ROUTE_NOT_CHECK = [
    `${prefix}`,
    `${prefix}/auth/token`,
    `${prefix}/auth/refresh-token`,
    // `${prefix}/auth/logout`,
    `${prefix}/user/password`,
    `${prefix}/province/get-options`,
    `${prefix}/district/get-options`,
    `${prefix}/ward/get-options`,
];

const REGEX_ROUTE_NOT_CHECK = [
    '/api\\/swagger*.', // eslint-disable-line no-useless-escape
    '/uploads*',
];

module.exports = async (req, res, next) => {
    const path = req.path;
    // Exclude routes don't need check
    if (ROUTE_NOT_CHECK.includes(path)) {
        return next();
    }

    // Exclude regex routes don't need check
    for (let i = 0; i < REGEX_ROUTE_NOT_CHECK.length; i++) {
        const pattern = new RegExp(REGEX_ROUTE_NOT_CHECK[i]);
        if (pattern.test(path)) {
            return next();
        }
    }

    // Get authorization header
    const {authorization} = req.headers;

    if (authorization && /^Bearer /.test(authorization)) {
        // Remove Bearer from string
        const token = authorization.replace('Bearer ', '');
        try {
            const decoded = jwt.verify(token, config.hashSecretKey);
            // console.log(decoded);
            // set information user to request.auth
            req.auth = decoded;
            req.body.auth_id = decoded.user_id;
            req.body.auth_name = decoded.user_name;
            req.auth.authorization = authorization;
            req.body.auth_companies = decoded.user_companies;
            const isactive = await userServices.checkToken(token);

            // return next();
            if (isactive) return next();
            else {
                return res.json({
                    data: null,
                    message: 'logged in on another device',
                    status: 10010,
                    errors: null,
                });
            }
        } catch (e) {
            return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null, e.message));
        }
    }

    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, '', RESPONSE_MSG.AUTH.LOGIN.TOKEN_REQUIRED));
};
