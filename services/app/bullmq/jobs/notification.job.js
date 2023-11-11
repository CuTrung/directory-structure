// Notification run job as 
// + push single notification 
// + create notification 
// + use topic notification has action 
const NotifyService = require('../../module/notify/notify.service');
const logger = require('../../common/classes/logger.class');
const QUEUE = require('../queue');
const fcm = require('../../common/services/fcm.service');
const apn = require('../../common/services/apn.service');
const config = require('../../../config/config')

const process = async (type, payload) => {
    if (!type || !payload) return;
    switch (type) {
        case 'notification.create':
            return await createNotification(payload);
        case 'notification.push':
            return await pushNotification(payload);
        case 'notification.topic.push':
            return await pushTopic(payload);
        case 'notification.topic.subscribe':
            return await subscribeTopic(payload);
        case 'notification.topic.unsubscribe':
            return await unsubscribeTopic(payload);
    }
}

// Create notification and send it to member receive
const createNotification = async (payload = {}) => {
    logger.info(`[notification-job:createNotification] Received ${JSON.stringify(payload)}`);
    if (!payload || !Object.keys(payload).length) return;
    if (!payload.members) payload.members = [payload.RECEIVER];
    try {
        for (let i = 0; i < payload.members.length; i++) {
            const member = payload.members[i]
            const notify = await NotifyService.create(Object.assign({}, payload, {
                RECEIVER: member.member_id || member
            }));
            if (notify) {
                logger.info('[notification-job:createNotification] Create notify successfully %s', JSON.stringify({ notify }));
                QUEUE.add({
                    type: 'notification.push',
                    payload: notify
                });
                logger.info("[notification-job:createNotification] Published results for push notification:", notify);
            }
            else {
                logger.error(`[notification-job:createNotification] Create failed or already exist ${JSON.stringify(payload)}`)
            }
        }
    } catch (error) {
        logger.error(error, { 'function': 'notification-job.createNotification' });
    }
}

// Push notification 
const pushNotification = async (payload = {}) => {
    if (!payload || !Object.keys(payload).length) return;
    const { provider = 'fcm' } = payload;
    logger.info(`[notification-job:pushNotification] Received ${JSON.stringify(payload)}`);
    try {
        // push apn callkit
        if (provider == 'apn') { await apn.push(payload); }
        // push use firebase
        if (provider == 'fcm') { await fcm.push(payload); }
    } catch (error) {
        logger.error(error, { 'function': 'notification-job.pushNotification' });
    }
}

// Push topic 
const pushTopic = async (payload = {}) => {
    if (!payload || !Object.keys(payload).length) return;
    logger.info(`[notification-job:pushTopic] Received ${JSON.stringify(payload)}`);
    try {
        const msg = await fcm.sendToTopic(payload, config.BULLMQ.TOPIC)
        console.log(`Push topic success ${msg}`)
    } catch (error) {
        logger.error(error, { 'function': 'notification-job.pushTopic' });
    }
}

// Subscribe topic 
const subscribeTopic = async (payload = {}) => {
    if (!payload || !Object.keys(payload).length) return;
    logger.info(`[notification-job:subscribeTopic] Received ${JSON.stringify(payload)}`);
    const { topic = config.BULLMQ.TOPIC, tokens = [] } = payload;
    console.log("🚀 ~ file: notification.job.js ~ line 88 ~ subscribeTopic ~ tokens", tokens)
    try {
        await fcm.subscribeToTopic(tokens, topic)
    } catch (error) {
        logger.error(error, { 'function': 'notification-job.subscribeTopic' });
    }
}

// Unsubscribe topic 
const unsubscribeTopic = async (payload = {}) => {
    if (!payload || !Object.keys(payload).length) return;
    logger.info(`[notification-job:unsubscribeTopic] Received ${JSON.stringify(payload)}`);
    const { topic = config.BULLMQ.TOPIC, tokens = [] } = payload;
    try {
        await fcm.unsubscribeFromTopic(tokens, topic)
    } catch (error) {
        logger.error(error, { 'function': 'notification-job.unsubscribeTopic' });
    }
}
module.exports = {
    process
}