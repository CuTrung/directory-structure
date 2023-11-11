const logger = require('../../common/classes/logger.class');
const taskTypeService = require('../../module/task-type/task-type.service');

const process = async (type, payload) => {
  if (!type || !payload) return;
  switch (type) {
    case 'task-type.update':
      return await createCareTaskByTaskType(payload);
    case 'task-type.createSendEmailSMS':
      return await createSendEmailSMS(payload);
  }
};

const createCareTaskByTaskType = async (payload = {}) => {
  logger.info(`[care-customer-job:createCareTaskByTaskType]`);
  try {
    await taskTypeService.createCareTaskByTaskType(payload);
  } catch (error) {
    logger.error(error, {
      function: 'customer-type-job.createCareTaskByTaskType',
    });
  }
};

const createSendEmailSMS = async (payload = {}) => {
  logger.info(`[care-customer-job:createSendEmailSMS]`);
  try {
    await taskTypeService.sendEmailSMSCronJob(payload);
  } catch (error) {
    logger.error(error, {
      function: 'customer-type-job.createSendEmailSMS',
    });
  }
};

module.exports = {
  process,
};
