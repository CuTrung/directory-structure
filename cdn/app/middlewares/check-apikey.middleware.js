const RESPONSE_MSG = require('../common/const/responseMsg.const');
const httpStatus = require('http-status');
const config = require('../../config/config');
const ErrorResponse = require('../common/responses/error.response');


const REGEX_ROUTE_NOT_CHECK = [
    '\/file\*'
];

module.exports = async (req, res, next) => {
    const path = req.path;

    // Exclude regex routes don't need check
    for (let i = 0; i < REGEX_ROUTE_NOT_CHECK.length; i++) {
        const pattern = new RegExp(REGEX_ROUTE_NOT_CHECK[i]);
        if (pattern.test(path)) {
            return next();
        }
    }

    // Get authorization header
    const { authorization } = req.headers;

    if (authorization && /^APIKEY /.test(authorization)) {
        // Remove Bearer from string
        const token = authorization.replace('APIKEY ', '');
        try {
            if (token !== config.apiKey) throw RESPONSE_MSG.TOKEN_REQUIRED;
            return next();
        } catch (e) {
            return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null, e.message));
        }
    }

    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, '', RESPONSE_MSG.TOKEN_REQUIRED));
};
