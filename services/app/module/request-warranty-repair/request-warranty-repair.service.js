const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');

const detail = async (request_id, user_send, type) => {
    try {
        const pool = await mssql.pool;
        const requestRes = await pool.request()
            .input('REQUESTID', request_id)
            .input('USERNAME', sql.VarChar(100), user_send)
            .execute('RS_RQ_WARRANTY_REPAIR_GetDetailToPush_Service');

        if (!requestRes.recordset.length) return [];
        let { USERNAME = '', FULLNAME = '', REQUESTTYPENAME, REQUESTCODE, COORDINATOR, CHECKERUSER } = requestRes.recordset[0];

        // format mail 
        let title = USERNAME + ' - ' + FULLNAME
        let content = `Phiếu yêu cầu ${REQUESTTYPENAME} - ${REQUESTCODE} vừa được cập nhật, vui lòng kiểm tra`
        let subContent = content.substr(0, 100);
        if (content.length > 100) subContent += "...";
        // notification format
        let notification = {
            notification: {
                title, body: subContent
            },
            data: {
                id: `${request_id}`.toString(), key: 'REQUEST',
            }
        }
        const tokenRes = await pool.request()
            .input('REQUESTID', request_id)
            .input('USERNAME', sql.VarChar(100), user_send)
            .input('COORDINATOR', sql.VarChar(100), COORDINATOR)
            .input('CHECKERUSER', sql.VarChar(100), CHECKERUSER)
            .execute('RS_RQ_WARRANTY_REPAIR_GetTokenToPush_Service');

        notification.tokens = (tokenRes.recordset || []).map((token) => token.DEVICETOKEN)
        return notification;

    } catch (e) {
        logger.error(e, { 'function': 'request.detail' });
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


module.exports = {
    detail,
    createNotifyLog
};