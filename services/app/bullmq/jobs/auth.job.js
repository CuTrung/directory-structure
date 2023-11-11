const logger = require('../../common/classes/logger.class');
const { pushNotification } = require('../../common/services/notification.service')
const MailService = require('../../module/mail/mail.service');
const config = require('../../../config/config');
const MailHelper = require('../../common/helpers/mail.helper');
const EventService = require('../../module/event/event.service');

const process = async (type, payload) => {
    // console.log("🚀 ~ file: email.job.js ~ line 9 ~ process ~ payload", payload)
    if (!type || !payload) return;
    switch (type) {
        case 'auth.send':
            return await sendAuthNotification(payload);

    }
}

const sendAuthNotification = async (payload = {}) => {
    logger.info(`[email-job:sendEmailNotification]`);
    logger.info(payload);

    try {
        const { token, device_name, user_send, platform } = payload;
        const notification = {
            title: `Thiết bị ${device_name ? device_name : 'Khác'} đã đăng nhập tài khoản của bạn`,
            body: `Nếu không phải bạn, vui lòng liên hệ chúng tôi để được hỗ trợ`,
            "sound": "default"
        }
        const data = {
            "message": `Thiết bị ${device_name ? device_name : 'Khác'} đã đăng nhập trên tài khoản của bạn.`,
            "key": 'LOGIN_OTHER_DEVICE',
            "value": "LOGOUT"
        }
        console.log(notification.title);
        const rs = await MailService.createNotifyLog(6, notification, user_send, platform, token)

        pushNotification({
            notification, data, token: token
        }, rs.ID)



    } catch (error) {
        logger.error(error, { 'function': 'email-job.sendAuthNotification' });
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