const logger = require('../../common/classes/logger.class');
const PreOrderService = require('../../module/pre-order/pre-order.service');

const process = async (type, payload) => {
  if (!type || !payload) return;
  switch (type) {
    case 'pre-order.sendSMS':
      return await sendSMS(payload);
  }
};

const sendSMS = async (payload) => {
  logger.info('pre-order:sendSMS');
  try {
    await PreOrderService.sendSMS(payload);
  } catch (error) {
    logger.error(error, { function: 'pre-order-job.sendSMS' });
  }
};

module.exports = {
  process,
};
