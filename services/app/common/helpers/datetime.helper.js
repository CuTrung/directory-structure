const moment = require('moment');

const getCurrentDateTime = () => (
    moment().seconds(0).utc().toISOString()
);

const formatDateTimeWithUTC = (datetime) => {
    moment(datetime).format('LLLL UTC');
};

const delay = (d) => new Promise((r) => setTimeout(r, d));

module.exports = {
    getCurrentDateTime,
    formatDateTimeWithUTC,
    delay
};
