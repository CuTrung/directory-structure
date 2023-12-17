const { Queue } = require("bullmq");
const config = require("../../config/index.config");
const logger = require("../common/classes/logger.class");

const queue = new Queue(config.BULLMQ.QUEUE, { connection: config.redis });

queue.on("waiting", (job) => {
  logger.info(`${config.BULLMQ.QUEUE} WAITING ${JSON.stringify(job)}`);
});

const push = (data, opts = {}) => {
  const _opts = Object.assign({}, opts, {
    removeOnComplete: true,
    removeOnFail: true,
  });
  queue.add(config.BULLMQ.QUEUE, data, _opts);
};

module.exports = {
  queue,
  push,
};
