const formatString = (str, params) => {
    Object.keys(params || {}).forEach(key => {
        str = str.replace(`{${key}}`, params[key]);
    })
    return str;
}

module.exports = {
    formatString
};
