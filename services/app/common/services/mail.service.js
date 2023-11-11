const logger = require('../classes/logger.class')
const htmlHelper = require('../helpers/html.helper');
const mailHelper = require('../helpers/mail.helper');
const mssql = require('../../models/mssql');
const sql = require("mssql");
const apiHelper = require('../helpers/api.helper');
const ServiceResponse = require("../responses/service.response");
const templateHelper = require('../helpers/template.helper');
const BULLMQ = require('../../bullmq/queue')

const sendMail = async (data) => {
    try {
        logger.info(`Create mail`);
        // create email with template 
        const { template, title, params, to } = data;
        if (!template || !to || !title || !params) return;
        const mailBody = htmlHelper.format({
            template,
            mail: params
        });
        await mailHelper.send({
            to, subject: title, html: mailBody
        })
        logger.info(`Send email successfully!!!`)
    } catch (error) {
        logger.error(error, {
            f: "modules/mail/mail.service/send",
        });
    }
}


const sendToInside = async function (mail = {}, TYPE = 'OFFWORK', subitle = null) {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const template = templateHelper.createMail(TYPE, mail, subitle);
        mail = { ...mail, ...template, is_sendtoall: 0 }

        const requestMailCreate = new sql.Request(transaction);
        const resultMailCreate = await requestMailCreate
            .input("PARENTID", sql.Int, 0)
            .input("ISSENDTOALL", apiHelper.getValueFromObject(mail, "is_sendtoall"))
            .input("MAILSUBJECT", apiHelper.getValueFromObject(mail, "mail_subject"))
            .input("MAILCONTENT", apiHelper.getValueFromObject(mail, "mail_content"))
            .input("CREATEDUSER", apiHelper.getValueFromObject(mail, "user_name"))
            .execute("SYS_MAILBOX_CreateMail_WebAdmin");

        const mailId = resultMailCreate.recordset[0].RESULT;
        if (!mailId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Create mail send failed!')
        }
        const users = apiHelper.getValueFromObject(mail, "users")
        if (users && users.length) {
            for (let i = 0; i < users.length; i++) {
                const requestMailUser = new sql.Request(transaction);
                const resultMailUser = await requestMailUser
                    .input("MAILID", mailId)
                    .input("USERNAME", apiHelper.getValueFromObject(users[i], 'user_name'))
                    .execute("SYS_MAILBOX_CreateMailUser_WebAdmin");
                const mailUserId = resultMailUser.recordset[0].RESULT;

                if (!mailUserId) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Can not send email to user!')
                }
            }
        }
        const departments = apiHelper.getValueFromObject(mail, "departments")
        if (departments && departments.length) {
            for (let i = 0; i < departments.length; i++) {
                const requestMailUser = new sql.Request(transaction);
                const resultMailUser = await requestMailUser
                    .input("MAILID", mailId)
                    .input("DEPARTMENTID", apiHelper.getValueFromObject(departments[i], 'user_name'))
                    .execute("SYS_MAILBOX_CreateMailUser_WebAdmin");
                const mailUserId = resultMailUser.recordset[0].RESULT;
                if (!mailUserId) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Can not send email to user!')
                }
            }
        }
        const requestMailBoxCreate = new sql.Request(transaction);
        const resultMailBoxCreate = await requestMailBoxCreate
            .input("MAILID", mailId)
            .input("USERNAME", apiHelper.getValueFromObject(mail, "user_name"))
            .input("ISREAD", 0)
            .input("ISDELETED", 0)
            .input("ISFORCEDELETED", 0)
            .input("ISFLAGGED", 0)
            .input("ISDRAFT", 0)
            .input("CREATEDUSER", apiHelper.getValueFromObject(mail, "user_name"))
            .execute("SYS_MAILBOX_CreateMailBox_WebAdmin");
        const mailboxId = resultMailBoxCreate.recordset[0].RESULT;
        if (!mailboxId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Create mail box failed!')
        }
        await transaction.commit();
        if (mailId) {
            BULLMQ.add({
                type: "email.send",
                payload: { mail_id: mailId, user_send: apiHelper.getValueFromObject(mail, "user_name") },
            });
        }
        return new ServiceResponse(true, 'ok', mailId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { 'function': 'MailService.sendToInside' });
        return new ServiceResponse(false, e)
    }
};


module.exports = {
    sendMail,
    sendToInside
}
