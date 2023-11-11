const logger = require('../../common/classes/logger.class');
const { pushNotification, pushTopic } = require('../../common/services/notification.service')
const MailService = require('../../module/mail/mail.service');
const config = require('../../../config/config');
const MailHelper = require('../../common/helpers/mail.helper');
const EventService = require('../../module/event/event.service');

const process = async (type, payload) => {
    // console.log("🚀 ~ file: email.job.js ~ line 9 ~ process ~ payload", payload)
    if (!type || !payload) return;
    switch (type) {
        case 'email.send':
            return await sendEmailNotification(payload);
        case 'email.send.event':
            return await sendEmailEvent(payload);
    }
}

const sendEmailNotification = async (payload = {}) => {
    logger.info(`[email-job:sendEmailNotification]`);
    logger.info(payload);

    try {
        const { mail_id, user_send, flatform, list_user, list_cc_user } = payload;
        const notify = await MailService.detail(mail_id, user_send);
        console.log({ notify })
        const { all, notification, data, tokens = [] } = notify;
        if (1 * all === 1) {
            // push topic 
            pushTopic({ notification, data })
        }
        else {
            for (let j = 0; j < tokens.length; j++) {

                const rs = await MailService.createNotifyLog(5, notification, user_send, flatform, tokens[j])

                pushNotification({
                    notification, data, token: tokens[j]
                }, rs.ID)
            }
        }

    } catch (error) {
        logger.error(error, { 'function': 'email-job.sendEmailNotification' });
    }
}

const sendEmailEvent = async (payload = {}) => {
    logger.info(`[email-job:sendEmailEvent]: ${JSON.stringify(payload)}`);
    const { mail, is_update = 0, event_id, customer_id } = payload;
    try {
        if (!mail) {
            throw new Error(`Email không được cung cấp!`);
        }
        else {
            await MailHelper.send(mail)
            // Neu co update 
            if (is_update) {
                await EventService.update({ event_id, customer_id })
            }
        }
    } catch (error) {
        await EventService.updateSendEmailError({ event_id, customer_id, error: error.message || error });
        logger.error(error, { 'function': 'email-job.sendEmailEvent' });
    }
}


module.exports = {
    process
}