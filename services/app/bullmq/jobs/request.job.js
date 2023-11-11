const logger = require('../../common/classes/logger.class');
const { pushNotification, pushTopic } = require('../../common/services/notification.service')
const RequestService = require('../../module/request-warranty-repair/request-warranty-repair.service');

const process = async (type, payload) => {
    if (!type || !payload) return;
    switch (type) {
        case 'request.send':
            return await sendRequestNotification(payload);
    }
}

const sendRequestNotification = async (payload = {}) => {
    logger.info(`[request-job:sendRequestNotification]`);
    logger.info(payload);

    try {
        const { request_id, user_send, flatform, type } = payload;
        const notify = await RequestService.detail(request_id, user_send, type);
        const { notification, data, tokens = [] } = notify;

        for (let j = 0; j < tokens.length; j++) {
            const rs = await RequestService.createNotifyLog(5, notification, user_send, flatform, tokens[j])
            pushNotification({
                notification, data, token: tokens[j]
            }, rs.ID)
        }
    } catch (error) {
        logger.error(error, { 'function': 'request-job.sendRequestNotification' });
    }
}

module.exports = {
    process
}