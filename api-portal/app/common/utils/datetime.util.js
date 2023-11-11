const moment = require('moment');

const getCurrentDateTime = () => moment().seconds(0).utc().toISOString();

const formatDateTimeWithUTC = (date_time) => moment(date_time).format('LLLL UTC');

const formatDate = (date) =>
    new Intl.DateTimeFormat(['ban', 'id'], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    })
        .format(date)
        .replaceAll('.', ':')
        .replace(' ', ', ');

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return formatDate(result).split(',')[0];
};

module.exports = {
    getCurrentDateTime,
    formatDateTimeWithUTC,
    formatDate,
    addDays,
};
