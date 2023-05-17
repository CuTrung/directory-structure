module.exports = {
    isTypeArray: (typeArr, arr) => arr.every(item => typeof item === typeArr),
    isNumeric: (value) => {
        if (typeof value === 'string') return !isNaN(value % 1);
        return typeof value === 'number';
    },
    isObject: (value) => {
        return typeof value === 'object' && !Array.isArray(value) &&
            value !== null;
    },
    getValueNested: (obj, keyNested) => {
        keyNested = keyNested.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        keyNested = keyNested.replace(/^\./, '');           // strip a leading dot
        var a = keyNested.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in obj) {
                obj = obj[k];
            } else {
                return;
            }
        }
        return obj;
    },
    getValueLastNested: (obj) => {
        if (typeof obj !== 'object') {
            return obj;
        }
        for (prop in obj) {
            return getValueLastNested(obj[prop])
        }
    },
    convertObjectToStringNested: (obj, name) => {
        let outputObj = {};
        let recursive = (obj, name) => {
            for (let key in obj) {
                if (typeof obj[key] == 'object') {
                    recursive(obj[key], name + '.' + key)
                } else {
                    outputObj[name + '.' + key] = obj[key];
                }
            }
        }
        recursive(obj, name)
        return outputObj;
    }
}