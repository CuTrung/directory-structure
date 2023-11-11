const { Queue, QueueScheduler } = require('bullmq');
const config = require('../../config/config');
const logger = require('../common/classes/logger.class');

const queue = new Queue(config.BULLMQ.QUEUE, { connection: config.redis });

const add = (data, opts = {}) => {
    const _opts = Object.assign({}, opts, { removeOnComplete: true, removeOnFail: true })
    queue.add(config.BULLMQ.QUEUE, data, _opts)
}

module.exports = {
    queue,
    add
};