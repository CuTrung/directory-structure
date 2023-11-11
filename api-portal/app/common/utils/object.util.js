const { isTypeOf, TYPES } = require('./common.util');

const isObject = (value) => isTypeOf(value, TYPES.OBJECT);

const mergeObjectSameKey = (list = [], keyMatch = 'id', keysWantToMerge = []) => {
    const data = [];
    for (let item of list) {
        item = {
            ...item,
            ...keysWantToMerge.reduce((a, v) => ({ ...a, [v]: Array.isArray(item[v]) ? item[v] : [item[v]] }), {}),
        };

        const match = data.find((r) => r[keyMatch] === item[keyMatch]);
        if (match) {
            for (const keyMerge of keysWantToMerge) {
                match[keyMerge] = match[keyMerge].concat(item[keyMerge]);
            }
        } else {
            data.push(item);
        }
    }

    return data;
};

const getValueLastNested = (obj) => {
    if (!isObject(obj)) return obj;
    for (const prop in obj) {
        return getValueLastNested(obj[prop]);
    }
};

const getValueNested = (obj, keyNested) => {
    // Lấy giá trị cuối cùng nếu ko có keyNested
    if (!keyNested) return getValueLastNested(obj);
    keyNested = keyNested.replace(/\[(\w+)\]/g, '.$1');
    keyNested = keyNested.replace(/^\./, '');
    const a = keyNested.split('.');
    for (const i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
};

const convertObjectToStringNested = (obj, name) => {
    const outputObj = {};
    const recursive = (obj, name) => {
        for (const key in obj) {
            if (isObject(obj[key])) {
                recursive(obj[key], name + '.' + key);
            } else {
                outputObj[name + '.' + key] = obj[key];
            }
        }
    };
    recursive(obj, name);
    return outputObj;
};

const convertObjectToArray = (obj = {}) => (isObject(obj) ? Object.entries(obj) : null);

const pickObject = (object, pick = []) => (isObject(object) ? _.pick(object, pick) : null);

const omitObject = (object, omit = []) => (isObject(object) ? _.omit(object, omit) : null);

const getValue = (object, key, defaultValue) => pickObject(object, [key]) ?? defaultValue;

module.exports = {
    mergeObjectSameKey,
    getValueNested,
    convertObjectToStringNested,
    convertObjectToArray,
    pickObject,
    omitObject,
    getValue,
};
