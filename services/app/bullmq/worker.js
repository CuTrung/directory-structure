const { Worker } = require('bullmq');
const logger = require('../common/classes/logger.class');
const config = require('../../config/config');
const bullmqJob = require('./job')


module.exports = () => {
    const worker = new Worker(config.BULLMQ.QUEUE, async job => {
        let RESULT = { s: 'ok', d: { ...job.data, ...{ COMPLETED: true } } };
        try {
            RESULT = await bullmqJob.process(job.data);
        } catch (error) {
            logger.error(`WORKER ${config.BULLMQ.QUEUE} error ${error}`);
            RESULT = Object.assign({}, RESULT, { COMPLETED: false, s: 'error', errmsg: error.message || error || 'WORKER PROCESS ERROR' });
        }
        return RESULT;
    }, {
        connection: config.redis,
        concurrency: 100
    });
}