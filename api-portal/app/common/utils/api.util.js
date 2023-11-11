const API = require('../const/api.const');
const _ = require('lodash');
const ListResponse = require('../responses/list.response');
const SingleResponse = require('../responses/single.response');
const ErrorResponse = require('../responses/error.response');

const TYPES_RES = {
    single: SingleResponse,
    list: ListResponse,
    error: ErrorResponse,
};

const formatResponse = ({ data, message, status } = {}, classType = status ? TYPES_RES.single : TYPES_RES.error) => {
    let result;
    if (!status) {
        // errors
        result = new classType(null, data, message);
    } else {
        result = new classType(data, message);
    }
    return {
        send: (res) => res.status(result.status).json(result),
    };
};

module.exports = {
    TYPES_RES,
    formatResponse,
};
