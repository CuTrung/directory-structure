const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const notifyClass = require('./notify.class');
const notifyTypeClass = require('../notify-type/notify-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');

const update = async (params = {}) => {
  try {
    const { notify_id = null, notify_member_id = null, isPushed = false, isError = false } = params;
    const pool = await mssql.pool;
    await pool.request()
      .input('NOTIFYID', notify_id)
      .input('NOTIFYMEMBERID', notify_member_id)
      .input('ISPUSHED', isPushed)
      .input('ISERROR', isError)
      .execute(PROCEDURE_NAME.SYS_NOTIFY_UPDATE_SERVICE);
    logger.info(`update ${JSON.stringify(params)} ... `)
  } catch (e) {
    logger.error(e, {'function': 'notifyService.update'});
  }
};

const create = async ( bodyParams = {}) => {
  try {
    const KEY = apiHelper.getValueFromObject(bodyParams, 'key');
    if(!KEY) return ;
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FEATUREKEY', KEY)
      .execute(PROCEDURE_NAME.SYS_NOTIFYTYPE_GETBYKEY_APP);
    const notifyType =  notifyTypeClass.detail(data.recordset[0]);
    if(!notifyType.notify_type_id) return ;
    const reqInfo = await pool.request()
        .input('SENDER', apiHelper.getValueFromObject(bodyParams, 'SENDER'))
        .input('RECEIVER', apiHelper.getValueFromObject(bodyParams, 'RECEIVER'))
        .input('GROUPID', apiHelper.getValueFromObject(bodyParams, 'group_id'))
        .execute(PROCEDURE_NAME.SYS_NOTIFY_GETINFO_APP)
    
    const info = notifyClass.info(reqInfo.recordset[0])
    logger.info(`body params: [info]:${JSON.stringify(info)} , [params]: ${JSON.stringify(bodyParams)}`)
    const reqNotify = await pool.request()
        .input('SENDER', apiHelper.getValueFromObject(bodyParams, 'SENDER'))
        .input('RECEIVER', apiHelper.getValueFromObject(bodyParams, 'RECEIVER'))
        .input('NOTIFYTITLE', stringHelper.formatString(notifyType.template_title, info))
        .input('NOTIFYCONTENT', stringHelper.formatString(notifyType.template_content, Object.assign({}, bodyParams, info)))
        .input('NOTIFYTYPEID', notifyType.notify_type_id)
        .input('GROUPID', apiHelper.getValueFromObject(bodyParams, 'group_id'))
        .input('NEWGROUPPOSTID', apiHelper.getValueFromObject(bodyParams, 'post_id'))
        .input('REPLYTOPOSTCOMMENTID', apiHelper.getValueFromObject(bodyParams, 'post_comment_id'))
        .input('HOTNEWSID', apiHelper.getValueFromObject(bodyParams, 'news_id'))
        .input('HOTMEDIAID', apiHelper.getValueFromObject(bodyParams, 'media_id'))
        .input('MEMBERRECOMMENDID', apiHelper.getValueFromObject(bodyParams, 'member_recommend_id'))
        .input('ISPUSHED', false)
        .input('ISACTIVE', true)
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
        .input('PICTUREURL', apiHelper.getValueFromObject(bodyParams, 'picture_url'))
        .execute(PROCEDURE_NAME.SYS_NOTIFY_CREATE_APP)

    if(reqNotify.recordset[0].READYTOPUSH == 0) return null;
    const res = notifyClass.detail(reqNotify.recordset[0]);
    const notify = {
        notification: {
            title: res.notify_title,
            body: res.notify_content
        },
        token: res.device_token,
        data: {
            key: KEY,
            group_id: res.group_id||'',
            post_id: res.post_id||'',
            news_id: res.news_id||'',
            media_id: res.media_id||'',
            post_comment_id: res.post_comment_id||'',
            picture_url: res.picture_url||''
        },
        notify: {
            notify_id: res.notify_id,
            notify_member_id: res.notify_member_id
        },
        member_id: apiHelper.getValueFromObject(bodyParams, 'RECEIVER')
    }
    // Lay thong tin ket doi 
    if(KEY == 'PERSONALMATCH'){
      notify.data.match = JSON.stringify(apiHelper.getValueFromObject(bodyParams, 'match'))
    }
    if(KEY == 'INTRODUCEFRIEND'){
      notify.data.member_recommend_id =  bodyParams.member_recommend_id||''
    }
    return notify;
  } catch (e) {
    logger.error(`[notifyService.createNotify]: ${e}`);   
    return null;
  }
};

const createMemberHobbiesSuggest = async ( bodyParams = {}) => {
  try {
    const KEY = apiHelper.getValueFromObject(bodyParams, 'key');
    if(!KEY) return ;
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FEATUREKEY', KEY)
      .execute(PROCEDURE_NAME.SYS_NOTIFYTYPE_GETBYKEY_APP);
    const notifyType =  notifyTypeClass.detail(data.recordset[0]);
    if(!notifyType.notify_type_id) return ;
    const reqInfo = await pool.request()
        .input('SENDER', apiHelper.getValueFromObject(bodyParams, 'SENDER'))
        .input('RECEIVER', apiHelper.getValueFromObject(bodyParams, 'RECEIVER'))
        .input('GROUPID', apiHelper.getValueFromObject(bodyParams, 'group_id'))
        .execute(PROCEDURE_NAME.SYS_NOTIFY_GETINFO_APP)
    
    const info = notifyClass.info(reqInfo.recordset[0])
    logger.info(`body params: [info]:${JSON.stringify(info)} , [params]: ${JSON.stringify(bodyParams)}`)
    const reqNotify = await pool.request()
        .input('SENDER', apiHelper.getValueFromObject(bodyParams, 'SENDER'))
        .input('NOTIFYTITLE', stringHelper.formatString(notifyType.template_title, info))
        .input('NOTIFYCONTENT', stringHelper.formatString(notifyType.template_content, Object.assign({}, bodyParams, info)))
        .input('NOTIFYTYPEID', notifyType.notify_type_id)
        .input('ISPUSHED', false)
        .input('ISACTIVE', true)
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'SENDER'))
        .execute(PROCEDURE_NAME.SYS_NOTIFY_CREATEMEMBERHOBBIESSUGGEST_APP)
    let notifications = [];
    if(reqNotify && reqNotify.recordset && reqNotify.recordset.length){
      for(let i = 0; i < reqNotify.recordset.length; i ++){
        if(reqNotify.recordset[i].READYTOPUSH == 1){
          const res = notifyClass.detailMBHBSG(reqNotify.recordset[i]);
          const notify = {
              notification: {
                  title: res.notify_title,
                  body: res.notify_content
              },
              token: res.device_token,
              data: {
                  key: KEY,
                  member_recommend_id: `${apiHelper.getValueFromObject(bodyParams, 'SENDER')}`
              },
              notify: {
                  notify_id: res.notify_id,
                  notify_member_id: res.notify_member_id
              },
              member_id: res.member_id
          }
          notifications.push(notify)
        }
      }
    }
    return notifications;
  } catch (e) {
    logger.error(`[notifyService.createMemberHobbiesSuggest]: ${e}`);   
    return null;
  }
};

module.exports = {
  update,
  create,
  createMemberHobbiesSuggest
};


