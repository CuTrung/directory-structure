const that = module.exports = {
    isTypeArray: (typeArr, arr) => arr.every(item => typeof item === typeArr),
    isNumeric: (value) => (typeof value === 'string') ? !isNaN(value % 1) : (typeof value === 'number'),
    isObject: (value) => typeof value === 'object' && !Array.isArray(value) &&
        value !== null,
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
    },
    formatDate: (date) => new Intl.DateTimeFormat(['ban', 'id'], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(date).replaceAll(".", ":").replace(" ", ", "),
    removeDiacritics: (str = "") => str.normalize("NFD")?.replace(/\p{Diacritic}/gu, ""),
    currencyVND: (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 }).format(value),
    typeOf: (value) => Object.prototype.toString.call(value).slice(8, -1),
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return that.formatDate(result).split(",")[0];
    }
}