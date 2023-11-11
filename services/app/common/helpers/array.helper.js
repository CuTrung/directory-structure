const isEmptyArray = (data) => (
    Boolean(!data || data.constructor !== Array || !data.length)
);

module.exports = {
    isEmptyArray,
};
