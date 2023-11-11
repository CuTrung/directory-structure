const Queue = require('bull');
const config = require('../../../config/index.config');

const CONFIG = {
    redis: config.redis,
};

const QUEUE_CONST = {
    NOTIFICATION: 'MINHLONGTEST_BULLMQ_NOTIFICATION',
    MAIL: 'MINHLONGTEST_BULLMQ_MAIL',
};

const mail = new Queue(QUEUE_CONST.MAIL, CONFIG);
const notification = new Queue(QUEUE_CONST.NOTIFICATION, CONFIG);

module.exports = {
    mail,
    notification,
};
