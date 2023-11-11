const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const taskTypeClass = require('./task-type.class');
const sql = require('mssql');
const moment = require('moment');
const apiHelper = require('../../common/helpers/api.helper');
const cron = require('node-cron');
const BULLMQQUEUE = require('../../bullmq/queue');
const { convertToCronPattern, compliedTemplate } = require('./utils/utils');
const { sendOneMail } = require('./utils/mailchimp');
const { sendMultipleMessage_V4_post_json } = require('./utils/sms');

const CRON_JOBS = {};
const CRON_JOBS_SEND_EMAIL = {};
const CRON_JOBS_SEND_SMS = {};


const getById = async (taskTypeId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().input('TASKTYPEID', taskTypeId).execute('CRM_TASKTYPE_GetById_AdminWeb');

    if (!data.recordsets[0]) {
      return new ServiceResponse(false, 'Không tìm thấy loại công việc');
    }

    const task_wflow_list = taskTypeClass.listTaskWorkflow(data.recordsets[1]);
    const condition_list = taskTypeClass.listCondition(data.recordsets[2]);

    for (let i = 0; i < task_wflow_list.length; i++) {
      const { task_work_flow_id } = task_wflow_list[i];
      task_wflow_list[i].condition_list = condition_list.filter((c) => c.task_work_flow_id === task_work_flow_id);
    }

    const result = {
      ...taskTypeClass.getById(data.recordsets[0][0]),
      task_wflow_list,
      receiver_list: taskTypeClass.listUser(data.recordsets[3]),
      model_list: taskTypeClass.listModel(data.recordsets[4]),
    };

    return new ServiceResponse(true, '', result);
  } catch (error) {
    logger.error(error, { function: 'services.taskTypeService.getById' });
    return new ServiceResponse(false, error.message);
  }
};

const autoChangeWflow = async ({ task_type_id, task_detail_id }) => {
  try {
    const pool = await mssql.pool;

    const taskRes = await getById(task_type_id);
    const { task_wflow_list } = taskRes.getData();
    if (!task_wflow_list?.length) return;

    let initTaskWflow = task_wflow_list[0].task_work_flow_id;
    for (let i = 0; i < task_wflow_list.length; i++) {
      const taskFlowItem = task_wflow_list[i] || {};
      const taskFlowItemConditionDB = taskFlowItem?.condition_list?.filter((x) => x.is_database)[0];
      if (!taskFlowItemConditionDB?.condition_value_list?.length) {
        break;
      }
      let conditionFlag = false;
      for (let j = 0; j < taskFlowItemConditionDB.condition_value_list.length; j++) {
        try {
          const conditionValue = taskFlowItemConditionDB.condition_value_list[j];
          const resFlowItemConditionDB = await pool
            .request()
            .input('TASKDETAILID', task_detail_id)
            .input('CONDITIONVALUE', conditionValue)
            .execute('CRM_TASKTYPE_WFlowConditionDB_AdminWeb');

          if (resFlowItemConditionDB.recordset[0]?.RESULT) {
            conditionFlag = true;
            break;
          }
        } catch (error) {}
      }
      if (conditionFlag) {
        const nextWflowId = task_wflow_list[i + 1]?.task_work_flow_id || taskFlowItem.task_work_flow_id;
        initTaskWflow = nextWflowId;
      }
    }

    // change task workflow
    await pool
      .request()
      .input('TASKDETAILID', task_detail_id)
      .input('TASKWORKFLOWID', initTaskWflow)
      .input('CREATEDUSER', 'administrator')
      .execute('CRM_HISTORY_TASKDETAIL_ChangeWFlow_AdminWeb');
  } catch (error) {
    logger.error(error, { Service: 'TaskType.autoChangeWflow' });
  }
};

const createOrUpdateTask = async (payload) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    await transaction.begin();

    const createOrUpdateTask = new sql.Request(transaction);
    const resCreateOrUpdateTask = await createOrUpdateTask
      .input('TASKID', apiHelper.getValueFromObject(payload, 'task_id'))
      .input('TASKNAME', apiHelper.getValueFromObject(payload, 'task_name'))
      .input('TASKTYPEID', apiHelper.getValueFromObject(payload, 'task_type_id'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(payload, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(payload, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(payload, 'is_system'))
      .input('CREATEDUSER', 'administrator')
      .execute('CRM_TASK_CreateOrUpdate_AdminWeb');

    const taskId = resCreateOrUpdateTask.recordset[0].RESULT;

    if (!taskId || taskId <= 0) {
      throw new Error('Tạo công việc thất bại');
    }

    const member_list = apiHelper.getValueFromObject(payload, 'member_list', []);

    if (member_list?.length > 0) {
      for (let i = 0; i < member_list.length; i++) {
        const createDetailRes = await new sql.Request(transaction)
          .input('MEMBERID', member_list[i].member_id)
          .input('DATALEADSID', member_list[i].data_leads_id)
          .input('TASKID', taskId)
          .input('DEPARTMENTID', member_list[i].department_id)
          .input('USERNAME', member_list[i].staff_user)
          .input('SUPERVISORNAME', member_list[i].staff_user)
          .input('CREATEDUSER', 'administrator')
          .execute('CRM_TASKDETAIL_Create_AdminWeb');
        const detailId = createDetailRes.recordset[0].RESULT;
        autoChangeWflow({ task_type_id: payload.task_type_id, task_detail_id: detailId });
      }
    } else {
      throw new Error('Danh sách khách hàng là bắt buộc');
    }

    await transaction.commit();
    return new ServiceResponse(true, '', taskId);
  } catch (error) {
    await transaction.rollback();
    logger.error(error, { Service: 'TaskService.createOrUpdateTask' });
    return new ServiceResponse(false, error.message);
  }
};

const createCareTaskByTaskType = async (payload) => {
  try {
    const taskRes = await getById(payload.taskTypeId);
    const taskData = taskRes.getData();
    if (!taskData?.receiver_list?.length) {
      return new ServiceResponse(false, 'Không tìm thấy người nhận công việc');
    }

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('TASKTYPEID', payload.taskTypeId)
      .execute('CRM_TASKTYPE_GetCustomer_Service_V2');
    const memberList = data.recordsets[0].map((x) => ({ member_id: x.MEMBERID, data_leads_id: x.DATALEADSID }));

    if (!memberList?.length) {
      return new ServiceResponse(false, 'Không tìm thấy khách hàng cần chăm sóc');
    }

    const nowDate = moment().format('DD/MM/YYYY hh:mm');

    // #region: chia công việc đều cho các nhân viên
    if (taskData.is_equal_divide) {
      const chunkSize = Math.ceil(memberList.length / taskData.receiver_list.length);
      for (let i = 0; i < taskData.receiver_list.length; i++) {
        const receiver = taskData.receiver_list[i];
        const memberListChunk = memberList.slice(i * chunkSize, (i + 1) * chunkSize).map((x) => ({
          ...x,
          staff_user: receiver.user_name,
          department_id: receiver.department_id,
        }));

        await createOrUpdateTask({
          task_name: `Công việc hệ thống tự động tạo - ${receiver.user_name} - ${nowDate}`,
          description: `Công việc hệ thống tự động tạo - ${receiver.user_name} - ${nowDate}`,
          task_type_id: payload.taskTypeId,
          is_active: 1,
          is_system: 0,
          member_list: memberListChunk,
        });
      }
    }
    // #endregion: chia công việc đều cho các nhân viên

    // #region: chia công việc theo tỉ lệ
    if (taskData.is_ratio_divide) {
      function splitArrayByPercent(list, percentages) {
        const totalItems = list.length;
        const splitPoints = percentages.map((p) => Math.ceil((totalItems * p) / 100));
        const splitArrays = [];
        let startIndex = 0;

        for (let index = 0; index < splitPoints.length; index++) {
          const splitPoint = splitPoints[index];
          const splitArray =
            index === splitPoints.length - 1 ? list.slice(startIndex) : list.slice(startIndex, startIndex + splitPoint);
          splitArrays.push(splitArray);
          startIndex += splitPoint;
        }

        return splitArrays;
      }

      const percentList = taskData.receiver_list.map((x) => +x.value_ratio || 0);
      const memberListChunked = splitArrayByPercent(memberList, percentList);

      for (let i = 0; i < taskData.receiver_list.length; i++) {
        const receiver = taskData.receiver_list[i];
        const _memberListChunked = memberListChunked[i].map((x) => ({
          ...x,
          staff_user: receiver.user_name,
          department_id: receiver.department_id,
        }));

        await createOrUpdateTask({
          task_name: `Công việc hệ thống tự động tạo - ${receiver.user_name} - ${nowDate}`,
          description: `Công việc hệ thống tự động tạo - ${receiver.user_name} - ${nowDate}`,
          task_type_id: payload.taskTypeId,
          is_active: 1,
          is_system: 0,
          member_list: _memberListChunked,
        });
      }
    }
    // #endregion: chia công việc theo tỉ lệ

    return new ServiceResponse(true, '', {});
  } catch (error) {
    logger.error(error, { Service: 'taskTypeService.createCareTaskByTaskType' });
    return new ServiceResponse(true, '', {});
  }
};

const updateTaskTypeJob = ({ cronName, taskTypeId, time, isOnce = false }) => {
  try {
    if (CRON_JOBS[cronName]) {
      CRON_JOBS[cronName].stop();
      delete CRON_JOBS[cronName];
    }
    const runTask = async () => {
      try {
        BULLMQQUEUE.add({
          type: 'task-type.update',
          payload: { run: true, taskTypeId },
        });
        if (isOnce) {
          CRON_JOBS[cronName].stop();
          delete CRON_JOBS[cronName];
        }
      } catch (error) {
        logger.error(error, { function: 'taskTypeService.updateTaskTypeJob [1]' });
      }
    };
    CRON_JOBS[cronName] = cron.schedule(time, runTask, {
      timezone: 'Asia/Ho_Chi_Minh',
    });
  } catch (error) {
    logger.error(error, { function: 'taskTypeService.updateTaskTypeJob [2]' });
  }
};

const initCronJob = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', -1)
      .input('PageIndex', 1)
      .input('ISACTIVE', 1)
      .input('ISTASKTYPEAUTO', 1)
      .execute('CRM_TASKTYPE_GetList_AdminWeb');

    const autoTaskTypeList = taskTypeClass.list(data.recordset);

    for (let i = 0; i < autoTaskTypeList.length; i++) {
      try {
        await updateTaskTypeCron(autoTaskTypeList[i]);
      } catch (error) {
        console.log('~  error >>>', error, autoTaskTypeList[i]);
      }
    }
  } catch (error) {
    logger.error(error, { function: 'taskTypeService.initCronJob' });
  }
};

const updateTaskTypeCron = async (body) => {
  const {
    task_type_id,
    is_filter_daily,
    is_filter_monthly,
    time_value_daily,
    time_value_monthly,
    is_filter_once,
    time_value_once,
    date_value,
  } = body;

  try {
    let time;
    if (is_filter_daily && time_value_daily) {
      const [hour, min] = time_value_daily.split(':');
      time = `${+min} ${+hour} * * *`;
    }
    if (is_filter_monthly && date_value && time_value_monthly) {
      const [hour, min] = time_value_monthly.split(':');

      // check if date not exist in current month => return last date in current month
      const date = new Date();
      const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const lastDateOfMonth = lastDate.getDate();
      const dateValue = +date_value;
      if (dateValue > lastDateOfMonth) {
        time = `${+min} ${+hour} ${lastDateOfMonth} * *`;
      } else {
        time = `${+min} ${+hour} ${date_value} * *`;
      }
    }
    if (is_filter_once && time_value_once) {
      const [day, month, year] = time_value_once.split('/').map(Number);
      time = `0 0 0 ${day} ${month} *`;
    }
    if (!time || !cron.validate(time)) {
      throw new Error(`Tần suất chăm sóc không hợp lệ [${task_type_id}] [${time}]`);
    }
    updateTaskTypeJob({
      cronName: `TASK_TYPE_${task_type_id}`,
      taskTypeId: task_type_id,
      isOnce: is_filter_once && time_value_once,
      time,
    });
    return new ServiceResponse(true, '', {});
  } catch (error) {
    logger.error(error, { function: 'taskTypeService.updateTaskTypeCron' });
    return new ServiceResponse(true, '', {});
  }
};

const sendEmailSMSCronJob = async () => {
  try {
    console.log('sendEmailSMSCronJob');
    const pool = await mssql.pool;
    /**
     * STEP 1.1: SAVE LIST CUSTOMER/LEADS INTO TABLE CRM_CUS_SENDEMAIL_TASK
     */
    const dataEmail = await pool.request().execute('CRM_TASKTYPE_GetListSendEmail_AdminWeb');
    const sendEmailList = taskTypeClass.listSendEmail(dataEmail.recordsets[0]);
    const sendEmailCustomerList = taskTypeClass.listTemplate(dataEmail.recordsets[1]);
    const sendEmailLeadsList = taskTypeClass.listTemplate(dataEmail.recordsets[2]);
    const sendEmailCronList = [];
    for (let i = 0; i < sendEmailList.length; i++) {
      try {
        const res = await pool
          .request()
          .input('TASKTYPEWFLOWEMAILID', apiHelper.getValueFromObject(sendEmailList[i], 'task_type_wflow_email_id'))
          .input('MEMBERID', apiHelper.getValueFromObject(sendEmailList[i], 'member_id'))
          .input('DATALEADSID', apiHelper.getValueFromObject(sendEmailList[i], 'data_leads_id'))
          .input('ISSEND', 0)
          .input('ISERROR', 0)
          .input('ERRORCONTENT', null)
          .input('SENDDATESCHEDULE', apiHelper.getValueFromObject(sendEmailList[i], 'send_date'))
          .execute('CRM_TASKTYPE_CreateOrUpdateSendEmailTask_AdminWeb');
        const customer_send_email_task_id = res.recordset[0].RESULT;
        const cusIndex = sendEmailCronList.findIndex(
          (x) => x.customer_send_email_task_id === customer_send_email_task_id,
        );
        const isLeads = Boolean(sendEmailList[i].data_leads_id);
        let customer = isLeads
          ? sendEmailLeadsList.find((x) => +x.data_leads_id === +sendEmailList[i].data_leads_id)
          : sendEmailCustomerList.find((x) => +x.member_id === +sendEmailList[i].member_id);

        if (cusIndex === -1 && customer) {
          let template = sendEmailList[i].email_template_html || '';
          template = template.replace(/{{/g, '<%= ').replace(/}}/g, ' %>');

          const compliedEmailContent = compliedTemplate(template, customer);

          sendEmailCronList.push({
            customer_send_email_task_id,
            ...sendEmailList[i],
            email_content: compliedEmailContent,
            customer,
          });
        }
      } catch (error) {
        logger.error(error, { function: 'taskTypeService.sendEmailItem' });
      }
    }

    /**
     * STEP 1.2: SAVE LIST CUSTOMER/LEADS INTO TABLE CRM_CUS_SENDSMS_TASK
     */
    const dataSMS = await pool.request().execute('CRM_TASKTYPE_GetListSendSMS_AdminWeb');
    const sendSMSList = taskTypeClass.listSendSMS(dataSMS.recordsets[0]);
    const sendSMSCustomerList = taskTypeClass.listTemplate(dataSMS.recordsets[1]);
    const sendSMSLeadsList = taskTypeClass.listTemplate(dataSMS.recordsets[2]);
    const sendSMSCronList = [];
    for (let i = 0; i < sendSMSList.length; i++) {
      try {
        const res = await pool
          .request()
          .input('TASKTYPEWFLOWSMSID', apiHelper.getValueFromObject(sendSMSList[i], 'task_type_wflow_sms_id'))
          .input('MEMBERID', apiHelper.getValueFromObject(sendSMSList[i], 'member_id'))
          .input('DATALEADSID', apiHelper.getValueFromObject(sendSMSList[i], 'data_leads_id'))
          .input('ISSEND', 0)
          .input('ISERROR', 0)
          .input('ERRORCONTENT', null)
          .input('SENDDATESCHEDULE', apiHelper.getValueFromObject(sendSMSList[i], 'send_date'))
          .execute('CRM_TASKTYPE_CreateOrUpdateSendSMSTask_AdminWeb');
        const customer_send_sms_task_id = res.recordset[0].RESULT;
        const cusIndex = sendSMSCronList.findIndex((x) => x.customer_send_sms_task_id === customer_send_sms_task_id);
        const customer = Boolean(sendSMSList[i].data_leads_id)
          ? sendSMSLeadsList.find((x) => +x?.data_leads_id === +sendSMSList[i]?.data_leads_id)
          : sendSMSCustomerList.find((x) => +x?.member_id === +sendSMSList[i]?.member_id);
        if (cusIndex === -1 && customer) {
          const sms_content_complied = compliedTemplate(sendSMSList[i].content_sms || '', customer);

          sendSMSCronList.push({
            customer_send_sms_task_id,
            ...sendSMSList[i],
            customer,
            sms_content_complied,
          });
        }
      } catch (error) {
        logger.error(error, { function: 'taskTypeService.sendSMSItem' });
      }
    }

    /**
     * STEP 2.1: CREATE CRON JOB SEND EMAIL FOR THIS LIST
     */
    const updateSendEmailJob = ({ cronName, time, isOnce = false, cronEmailItem }) => {
      try {
        if (!cron.validate(time)) {
          throw new Error(`INVALID CRON PATTERN [${time}]`);
        }
        if (CRON_JOBS_SEND_EMAIL[cronName]) {
          CRON_JOBS_SEND_EMAIL[cronName].stop();
          delete CRON_JOBS_SEND_EMAIL[cronName];
        }
        const runTaskSendEmail = async () => {
          const {
            mail_subject = '',
            mail_reply = '',
            mail_from = '',
            mail_from_name = '',
            customer = {},
            email_content,
          } = cronEmailItem;
          try {
            const mailSendRes = await sendOneMail({
              from_email: mail_from || 'shopdunk@nondev.tech',
              mail_to: customer.email,
              from_name: mail_from_name,
              mail_subject,
              mail_reply: mail_reply || 'shopdunk@nondev.tech',
              email_content,
            });
            if (isOnce) {
              CRON_JOBS_SEND_EMAIL[cronName].stop();
              delete CRON_JOBS_SEND_EMAIL[cronName];
            }
            if (mailSendRes.isFailed()) {
              throw new Error(mailSendRes.getError());
            }

            await pool
              .request()
              .input('TASKTYPEWFLOWEMAILID', apiHelper.getValueFromObject(cronEmailItem, 'task_type_wflow_email_id'))
              .input('MEMBERID', apiHelper.getValueFromObject(cronEmailItem, 'member_id'))
              .input('DATALEADSID', apiHelper.getValueFromObject(cronEmailItem, 'data_leads_id'))
              .input('ISSEND', 1)
              .input('ISERROR', 0)
              .input('ERRORCONTENT', null)
              .input('EMAILCONTENT', email_content)
              .input('SENDDATESCHEDULE', apiHelper.getValueFromObject(cronEmailItem, 'send_date'))
              .execute('CRM_TASKTYPE_CreateOrUpdateSendEmailTask_AdminWeb')
              .catch((err) => logger.error(err, { function: 'taskTypeService.runTaskSendEmail [1]' }));
          } catch (error) {
            logger.error(error, { function: 'taskTypeService.runTaskSendEmail [2]' });
            await pool
              .request()
              .input('TASKTYPEWFLOWEMAILID', apiHelper.getValueFromObject(cronEmailItem, 'task_type_wflow_email_id'))
              .input('MEMBERID', apiHelper.getValueFromObject(cronEmailItem, 'member_id'))
              .input('DATALEADSID', apiHelper.getValueFromObject(cronEmailItem, 'data_leads_id'))
              .input('ISSEND', 0)
              .input('ISERROR', 1)
              .input('ERRORCONTENT', error.message)
              .input('EMAILCONTENT', email_content)
              .input('SENDDATESCHEDULE', apiHelper.getValueFromObject(cronEmailItem, 'send_date'))
              .execute('CRM_TASKTYPE_CreateOrUpdateSendEmailTask_AdminWeb')
              .catch((err) => logger.error(err, { function: 'taskTypeService.runTaskSendEmail [3]' }));
          }
        };
        CRON_JOBS_SEND_EMAIL[cronName] = cron.schedule(time, runTaskSendEmail, {
          timezone: 'Asia/Ho_Chi_Minh',
        });
      } catch (error) {
        logger.error(error, { function: 'taskTypeService.updateSendEmailJob [4]' });
      }
    };

    for (let i = 0; i < sendEmailCronList.length; i++) {
      const cronEmailItem = sendEmailCronList[i];
      const time = convertToCronPattern(cronEmailItem.send_date);
      updateSendEmailJob({
        cronName: `SEND_EMAIL_${cronEmailItem.customer_send_email_task_id}`,
        time,
        // time: '23 20 10 8 *',
        isOnce: true,
        cronEmailItem,
      });
    }

    /**
     * STEP 2.2: CREATE CRON JOB SEND SMS FOR THIS LIST
     */
    const updateSendSMSJob = ({ cronName, time, isOnce = false, cronSMSItem }) => {
      try {
        if (!cron.validate(time)) {
          throw new Error(`INVALID CRON PATTERN [${time}]`);
        }
        if (CRON_JOBS_SEND_SMS[cronName]) {
          CRON_JOBS_SEND_SMS[cronName].stop();
          delete CRON_JOBS_SEND_SMS[cronName];
        }
        const runTaskSendSMS = async () => {
          const { sms_content_complied, brand_name, customer = {} } = cronSMSItem;
          try {
            const smsSendRes = await sendMultipleMessage_V4_post_json({
              brandname: brand_name,
              content: sms_content_complied,
              phone: customer?.phone_number,
              // sandbox: 1, // 1: test, 0: real
            });
            if (isOnce) {
              CRON_JOBS_SEND_SMS[cronName].stop();
              delete CRON_JOBS_SEND_SMS[cronName];
            }
            if (smsSendRes.isFailed()) {
              throw new Error(smsSendRes.getError());
            }

            await pool
              .request()
              .input('TASKTYPEWFLOWSMSID', apiHelper.getValueFromObject(cronSMSItem, 'task_type_wflow_sms_id'))
              .input('MEMBERID', apiHelper.getValueFromObject(cronSMSItem, 'member_id'))
              .input('DATALEADSID', apiHelper.getValueFromObject(cronSMSItem, 'data_leads_id'))
              .input('ISSEND', 1)
              .input('ISERROR', 0)
              .input('ERRORCONTENT', null)
              .input('SMSCONTENT', sms_content_complied)
              .input('SENDDATESCHEDULE', apiHelper.getValueFromObject(cronSMSItem, 'send_date'))
              .execute('CRM_TASKTYPE_CreateOrUpdateSendSMSTask_AdminWeb')
              .catch((err) => logger.error(err, { function: 'taskTypeService.runTaskSendSMS [3]' }));
          } catch (error) {
            logger.error(error, { function: 'taskTypeService.runTaskSendSMS [1]' });
            await pool
              .request()
              .input('TASKTYPEWFLOWSMSID', apiHelper.getValueFromObject(cronSMSItem, 'task_type_wflow_sms_id'))
              .input('MEMBERID', apiHelper.getValueFromObject(cronSMSItem, 'member_id'))
              .input('DATALEADSID', apiHelper.getValueFromObject(cronSMSItem, 'data_leads_id'))
              .input('ISSEND', 0)
              .input('ISERROR', 1)
              .input('ERRORCONTENT', error.message)
              .input('SMSCONTENT', sms_content_complied)
              .input('SENDDATESCHEDULE', apiHelper.getValueFromObject(cronSMSItem, 'send_date'))
              .execute('CRM_TASKTYPE_CreateOrUpdateSendSMSTask_AdminWeb')
              .catch((err) => logger.error(err, { function: 'taskTypeService.runTaskSendSMS [3]' }));
          }
        };
        CRON_JOBS_SEND_SMS[cronName] = cron.schedule(time, runTaskSendSMS, {
          timezone: 'Asia/Ho_Chi_Minh',
        });
      } catch (error) {
        logger.error(error, { function: 'taskTypeService.updateSendSMSJob [2]' });
      }
    };

    for (let i = 0; i < sendSMSCronList.length; i++) {
      const cronSMSItem = sendSMSCronList[i];
      const time = convertToCronPattern(cronSMSItem.send_date);
      updateSendSMSJob({
        cronName: `SEND_SMS_${cronSMSItem.customer_send_sms_task_id}`,
        time,
        isOnce: true,
        cronSMSItem,
      });
    }

    console.log('~ sendEmailSMSCronJob CRON_JOBS_SEND_EMAIL', Object.keys(CRON_JOBS_SEND_EMAIL));
    console.log('~ sendEmailSMSCronJob CRON_JOBS_SEND_SMS >>>', Object.keys(CRON_JOBS_SEND_SMS));
  } catch (error) {
    logger.error(error, { function: 'taskTypeService.createSendEmailAndSMS' });
  }
};

// createSendEmailAndSMS();

// const loggerCurrentCronJob = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   console.log('~  CRON_JOBS_SEND_EMAIL', Object.keys(CRON_JOBS_SEND_EMAIL));
//   console.log('~  CRON_JOBS_SEND_SMS >>>', Object.keys(CRON_JOBS_SEND_SMS));
// };
// loggerCurrentCronJob();

module.exports = {
  updateTaskTypeCron,
  createCareTaskByTaskType,
  initCronJob,
  sendEmailSMSCronJob,
};
