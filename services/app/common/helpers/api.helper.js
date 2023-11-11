const API = require('../const/api.const');
const uuidv1 = require('uuid');

/**
 * Check is object
 *
 * @param obj
 * @returns {boolean}
 */
const isObject = (obj) => {
    return obj instanceof Object;
};

/**
 * Convert to object
 *
 * @param obj
 * @returns {*}
 */
const convertToObject = (obj) => {
    if (!isObject(obj)) {
        return {};
    }

    return obj;
};

/**
 * Get value from object
 *
 * @param object
 * @param key
 * @param defaultValue
 * @returns {*}
 */
const getValueFromObject = (object, key, defaultValue = null) => {
    let obj = convertToObject(object);

    if (key in obj) {
        return obj[key];
    }

    return defaultValue;
};

/**
 * Get current page
 *
 * @param queryParams
 * @returns {number}
 */
const getCurrentPage = (queryParams = {}) => {
    return getValueFromObject(queryParams, 'page', API.PAGINATION.DEFAULT);
};

const getItemsPerPage = (queryParams = {}) => {
    return getValueFromObject(queryParams, 'itemsPerPage', API.PAGINATION.LIMIT);
};

const getSearch = (queryParams = {}) => {
    return getValueFromObject(queryParams, 'search', '');
};

const getOrderBy = (queryParams = {}) => {
    return getValueFromObject(queryParams, 'sortorder', API.SORT.ASC);
};

const getFilterBoolean = (queryParams = {}, key) => {
    let value = getValueFromObject(queryParams, key, API.ISACTIVE.ALL);
    if (value === null || value === '' || value === undefined) {
        return API.ISACTIVE.ALL;
    }
    return value;
};


const getLimit = (req) => {
    return req.query.itemsPerPage || API.PAGINATION.LIMIT;
};

const getPage = (req) => {
    return req.query.page || API.PAGINATION.DEFAULT;
};

const generateId = () => {
    return uuidv1.v1();
};

const getAuthId = (req) => {
    return req.auth.user_id;
};

const getQueryParam = (req, name) => {
    return req.query[name] || null;
};

const getTotalData = (data = {}) => {
    return (data.length && data[0]['TOTALITEMS']) || 0;
};

const getParam = (req, name) => {
    return req[name] || null;
};

module.exports = {
    getLimit,
    getPage,
    generateId,
    getAuthId,
    getQueryParam,
    getTotalData,
    getParam,

    getCurrentPage,
    getItemsPerPage,
    getValueFromObject,
    getSearch,
    getOrderBy,
    getFilterBoolean,
};
