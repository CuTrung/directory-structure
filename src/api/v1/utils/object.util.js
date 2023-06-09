module.exports = {
    getValueNested: (obj, keyNested) => {
        keyNested = keyNested.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        keyNested = keyNested.replace(/^\./, '');           // strip a leading dot
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
    },
    getValueLastNested: (obj) => {
        if (typeof obj !== 'object') return obj;
        for (const prop in obj) {
            return getValueLastNested(obj[prop])
        }
    },
    convertObjectToStringNested: (obj, name) => {
        const outputObj = {};
        const recursive = (obj, name) => {
            for (const key in obj) {
                if (typeof obj[key] == 'object') {
                    recursive(obj[key], name + '.' + key)
                } else {
                    outputObj[name + '.' + key] = obj[key];
                }
            }
        }
        recursive(obj, name)
        return outputObj;
    },
}