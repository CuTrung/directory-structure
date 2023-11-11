
const getJobType = type => {
    if (!type) return;
    const typeArr = `${type || ''}`.split('.');
    if (!typeArr || !typeArr.length) return;
    return typeArr[0];
}

module.exports = {
    getJobType
}