// const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
// const mssql = require('../../models/mssql');
// const logger = require('../../common/classes/logger.class');

// const detail = async (mailId,user_send) => {
//     try {
//         const pool = await mssql.pool;
//         const data = await pool.request()
//             .input('MAILID', mailId)
//             .input('USERNAME', user_send)
//             .execute(PROCEDURE_NAME.SYS_MAIL_GETDETAILTOPUSH_SERVICE);
//         if (!data.recordset.length) return [];
//         let { MAILSUBJECT: title = '', MAILCONTENT: content = '', ISSENDTOALL = 0, USERNAME = '', FULLNAME = '' } = data.recordset[0];
//         // format mail 
//         title = USERNAME + ' - ' + FULLNAME + '\n' + title
//         content = content.replace(/(<([^>]+)>)/gi, "");
//         let subContent = content.substr(0, 100);
//         if (content.length > 100) subContent += "...";
//         // notification format
//         let notification = {
//             all: 1, 
//             notification: {
//                 title, body: subContent
//             },
//             data: {
//                 id: `${mailId}`.toString(), key: 'MAIL' 
//             }
//         }
//         if (!ISSENDTOALL){
//             notification.all = 0;
//             notification.tokens = (data.recordsets[1] || []).map((token) => token.DEVICETOKEN)
//         }
//         return notification;

//     } catch (e) {
//         logger.error(e, { 'function': 'mail.detail' });
//         return null;
//     }
// };



// module.exports = {
//     detail
// };
const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');

const detail = async (mailId, user_send) => {
    try {
        const pool = await mssql.pool;
        const mailRes = await pool.request()
            .input('MAILID', mailId)
            .input('USERNAME', sql.VarChar(100), user_send)
            .execute('SYS_MAIL_GetDetailToPush_Service');

        if (!mailRes.recordset.length) return [];
        let { MAILSUBJECT: title = '', MAILCONTENT: content = '', ISSENDTOALL = 0, USERNAME = '', FULLNAME = '' } = mailRes.recordset[0];

        // format mail 
        title = USERNAME + ' - ' + FULLNAME + '\n' + title
        content = content.replace(/(<([^>]+)>)/gi, "");
        let subContent = content.substr(0, 100);
        if (content.length > 100) subContent += "...";
        // notification format
        let notification = {
            all: 1,
            notification: {
                title, body: subContent
            },
            data: {
                id: `${mailId}`.toString(), key: 'MAIL'
            }
        }
        if (!ISSENDTOALL) {
            notification.all = 0;
            const tokenRes = await pool.request()
                .input('MAILID', mailId)
                .input('USERNAME', sql.VarChar(100), user_send)
                .execute('SYS_MAIL_GetTokenToPush_Service');
            notification.tokens = (tokenRes.recordset || []).map((token) => token.DEVICETOKEN)
        }
        return notification;

    } catch (e) {
        logger.error(e, { 'function': 'mail.detail' });
        return null;
    }
};
const createNotifyLog = async (notify_type_id, notification, user_send, flatform, token) => {

    try {

        const pool = await mssql.pool;
        const NotifyLog = await pool.request()
            .input('NOTIFYTYPEID', notify_type_id)
            .input('NOTIFYLOGTITLE', notification.title)
            .input('NOTIFYLOGCONTENT', notification.body)
            .input('SENDERID', user_send)
            .input('CREATEDUSER', user_send)
            .input('FLATFORM', flatform)
            .input('DEVICETOKEN', token)
            .execute('SYS_NOTIFY_LOG_CREATE_APP');

        return NotifyLog.recordsets[0][0]

    } catch (e) {
        logger.error(e, { 'function': 'mail.createNotifyLog' });
        return null;
    }
};

const updateNotifyLog = async (notify_log_id, message, is_push) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('NOTIFYLOGID', notify_log_id)
            .input('MESSAGE', message)
            .input('ISPUSH', is_push)
            .execute('SYS_NOTIFY_LOG_update_APP');



    } catch (e) {
        logger.error(e, { 'function': 'mail.updateNotifyLog' });
        return null;
    }
};


module.exports = {
    detail,
    createNotifyLog,
    updateNotifyLog
};

