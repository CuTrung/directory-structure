const joi = require('joi');
const httpStatus = require('http-status');
const ErrorResponse = require('../common/responses/error.response');

module.exports = schema => (req, res, next) => {
    const auth = {
        auth_id: joi.string().required(),
        auth_name: joi.string().required(),
        auth_companies: joi.array().items(joi.string()).required(),
    };
    const {error} = joi.object(Object.assign(schema, auth)).validate(Object.assign(req.query, req.body, req.params));
    if (error) {
        const err = new ErrorResponse(httpStatus.BAD_REQUEST, 'UNAUTHORIZED');
        return res.status(err.status).json({
            message: error?.details,
            status: 400,
        });
    }
    next();
};
