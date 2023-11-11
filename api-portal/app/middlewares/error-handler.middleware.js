const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');

const logError = (error, req) => {
    let error_name = '';
    let error_content = '';

    switch (typeof error) {
        case 'string':
            error_name = error;
            error_content = error;
            break;
        case 'object':
            error_name = error.constructor.name;
            error_content = error.message;
            break;
    }

    // Ghi log vào DB
    const user = req.body;
    createError({
        user: JSON.stringify({
            user_name: user.user_name,
            user_id: user.user_id,
            user_agent: req.useragent,
        }),
        error_name,
        error_content,
        error_time: new Date(),
        event: '',
        module_name: '',
        parameter_content: JSON.stringify({
            body: req.body,
            error: error,
        }),
    });
};

module.exports = {
    errorHandler: (error, req, res, next) => {
        // Write log to system
        // logError(error, req);

        if (typeof error === 'string' || error instanceof String) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: error,
                status: httpStatus.BAD_REQUEST,
                data: null,
                errors: null,
            });
        }

        if (error instanceof ValidationError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: error.errors[0]?.messages[0]?.replace(/['"]/g, ''),
                errors: error.errors || null,
                data: null,
            });
        }
        switch (error.constructor.name) {
            case 'NotFoundResponse':
            case 'ErrorResponse':
                break;
            case 'ServiceResponse':
                error = {
                    status: httpStatus.BAD_REQUEST,
                    message: error.getMessage(),
                    errors: error.getErrors(),
                    data: error.getData(),
                };
                break;
            case 'Error':
                error = {
                    status: httpStatus.BAD_REQUEST,
                    message: error.message,
                    errors: error.errors ?? null,
                    data: null,
                };
                break;
            default:
                error = {
                    ...error,
                    data: null,
                    status: error.status ?? httpStatus.BAD_REQUEST,
                    message:
                        error.message ??
                        'Our app has encountered an unforeseen issue. We will have this addressed shortly.',
                };
                break;
        }
        return res.status(error.status).json(error);
    },
};
