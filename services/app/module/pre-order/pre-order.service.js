const sql = require('mssql');
const moment = require('moment');
const cron = require('node-cron');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const BULLMQQUEUE = require('../../bullmq/queue');
const preOrderClass = require('./pre-order.class');
const { sendMultipleMessage_V4_post_json } = require('../task-type/utils/sms');

/**
 * PRE_ORDER_[PREORDERID]_[ORDERID]
 */
const CRON_JOBS_PRE_ORDER = {};

const destroyCronJob = (cronName) => {
  try {
    if (CRON_JOBS_PRE_ORDER[cronName]) {
      CRON_JOBS_PRE_ORDER[cronName].stop();
      delete CRON_JOBS_PRE_ORDER[cronName];
    }
  } catch (error) {
    logger.error(error, { function: 'preOrderService.stopCronJob' });
  }
};

const runTaskSendSMS = async ({ cronName, preOrderData }) => {
  try {
    BULLMQQUEUE.add({ type: 'pre-order.sendSMS', payload: preOrderData });
    destroyCronJob(cronName);
  } catch (error) {
    logger.error(error, { function: 'preOrderService.updatePreOrderCronJob' });
  }
};

const updatePreOrderCronJob = ({ cronName, preOrderData, time }) => {
  try {
    destroyCronJob(cronName);
    if (!cron.validate(time)) {
      throw new Error('updatePreOrderCronJob: Invalid cron time');
    }
    CRON_JOBS_PRE_ORDER[cronName] = cron.schedule(time, () => {
      runTaskSendSMS({ cronName, preOrderData })
    }, {
      timezone: 'Asia/Ho_Chi_Minh',
    });
    // console.log('~  CRON_JOBS_PRE_ORDER >>>', Object.keys(CRON_JOBS_PRE_ORDER))
  } catch (error) {
    logger.error(error, { function: 'preOrderService.updatePreOrderCronJob' });
  }
};

/**
 * SMS sẽ được gửi vào lúc 8h sáng 3 ngày trước ngày hẹn nhân hàng
 */
const getListAndUpdateJobs = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute('SL_PREORDER_GetListToScheduleSendSMS_AdminWeb');
    const listToScheduleSendSMS = preOrderClass.listToScheduleSendSMS(data.recordset);
    for (let i = 0; i < listToScheduleSendSMS.length; i++) {
      const sendItem = listToScheduleSendSMS[i];
      const [day, month] = sendItem.send_date.split('/').map(Number)
      updatePreOrderCronJob({
        cronName: `PRE_ORDER_${sendItem.pre_order_id}_${sendItem.order_id}`,
        preOrderData: sendItem,
        time: `0 0 8 ${day} ${month} *`,
        // time: '*/1 17 19 8 *',
      })
    }
  } catch (error) {
    logger.error(error, { function: 'PreOrderService.scheduleSendSmsPayment' });
    return new ServiceResponse(true, '', {});
  }
};

const sendSMS = async (payload) => {
  try {
    console.log('~ sendSMS payload >>>', payload)
    await sendMultipleMessage_V4_post_json({
      phone: payload?.phone_number,
      // phone: '0329927227',
      content: `Xin chao ${payload.customer_name}. Ban vua tao don hang thanh cong. Ma don hang: ${(payload?.order_no || '').trim()}. Don hang nay chua duoc thanh toan. Ban hay tien hanh thanh toan de hoan thanh viec dat hang.`,
      brandname: 'SHOPDUNK',
    })
  } catch (error) {
    logger.error(error, { function: 'preOrderService.sendSMS' });
  }
}

const PreOrderService = {
  getListAndUpdateJobs,
  updatePreOrderCronJob,
  destroyCronJob,
  sendSMS,
};

module.exports = PreOrderService;
