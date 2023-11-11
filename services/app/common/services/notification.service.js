const logger = require('../classes/logger.class');
const fcm = require('./fcm.service');
const apn = require('./apn.service');
const config = require('../../../config/config');


// Push notification 
const pushNotification = async (payload = {}, id) => {

    if (!payload || !Object.keys(payload).length) return;
    const { provider = 'fcm' } = payload;
    logger.info(`[notification:pushNotification] Received ${JSON.stringify(payload)}`);
    try {
        // push apn callkit
        if (provider == 'apn') { await apn.push(payload); }
        // push use firebase
        if (provider == 'fcm') { await fcm.push(payload, id); }
    } catch (error) {
        logger.error(error, { 'function': 'notification.pushNotification' });
    }
}

// Push topic 
const pushTopic = async (payload = {}) => {
    if (!payload || !Object.keys(payload).length) return;
    logger.info(`[notification:pushTopic] Received ${JSON.stringify(payload)}`);
    try {
        await fcm.sendToTopic(payload, config.BULLMQ.TOPIC)
    } catch (error) {
        logger.error(error, { 'function': 'notification.pushTopic' });
    }
}

module.exports = {
    pushTopic,
    pushNotification
}
