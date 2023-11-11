const { send, admin } = require('./message.service');
const NotifyService = require('../../module/notify/notify.service');
const logger = require('../classes/logger.class');
const { get } = require('../helpers/redis.helper');
const MailService = require('../../module/mail/mail.service')

const push = async (payload, id) => {
    try {
        const { notification, data, token } = payload;
        await send(notification, token, data);
        MailService.updateNotifyLog(id, `Success`, 1)
        logger.info(`push firebase success to device ${token}`);
    } catch (error) {
        MailService.updateNotifyLog(id, error, o)
        logger.error(error, { 'function': 'notificationChanel.send' })
    }
}
// const push = async (payload) => {
//     const { notification, token, data, notify, member_id } = payload;
//     // send message user firebase
//     // kiem tra co push notify o day hay khong theo config cua nguoi dung 
//     // neu co memberid va co config tu redis thi kiem tra 
//     let shouldPushNotification = true;
//     if(member_id){
//         // lay config cua nguoi dung 
//         let config = await get(`member-appconfig:${member_id}`);
//         if( typeof config === 'string'){
//             try {
//                 config = JSON.parse(config)
//             } catch (error) {}
//         }
//         if(config && Object.keys(config).length){
//             // kiem tra cac key 
//             const { key = 'NONE' } = data;
//             switch(key){
//                 case 'NEWFEEDPOSTLIKE':
//                 case 'NEWFEEDCOMMENTLIKE':
//                 case 'NEWFEEDPOSTREPLY':
//                 case 'NEWFEEDPOSTCOMMENT':
//                     if(!config.is_notify_newsfeed_like_n_comment) shouldPushNotification = false;
//                     break;  
//                 case 'NEWFEEDNEWPOST':
//                 case 'NEWFEEDPOSTTAG':
//                     if(!config.is_notify_newsfeed_post) shouldPushNotification = false;
//                     break;   
//                 case 'REQUESTADDFRIEND':
//                 case 'ADDFRIEND':
//                 case 'PERSONALLIKE':
//                     if(!config.is_notify_friend_request) shouldPushNotification = false;
//                     break;  
//                 case 'LIKEPROFILEIMAGE':
//                 case 'LIKEPROFILE':
//                     if(!config.is_notify_profile_like_image) shouldPushNotification = false;
//                     break;  
//                 case 'LOGINEDONANOTHERDEVICE':
//                     if(!config.is_notify_other) shouldPushNotification = false;
//                     break; 
//                 case 'NEWSYSTEMNOTIFICATION':
//                 case 'PERSONALMATCH':
//                 case 'NEWNEWS':
//                     if(!config.is_notify_news_message) shouldPushNotification = false;
//                     break; 

//             }
//         }
//     }
//     let isPushed = false;
//     let isError = false;
//     try {
//         // kiem tra o day 
//         if(shouldPushNotification){
//             await send(notification, token, data);
//             logger.info(`push firebase success to device ${token}`);
//         }
//         else logger.info(`memberid has been off push firebase success to device ${token}`);
//         isPushed = true;
//     } catch (error) {
//         isError = false;
//         logger.error(error, { 'function': 'notificationChanel.send' })
//     } finally {
//         if (notify) NotifyService.update(Object.assign({}, notify, { isPushed, isError }))
//     }
// }

const subscribeToTopic = (tokens, topic) => {
    // console.log(tokens)
    if (!tokens || !tokens.length) {
        logger.log(`Not provide tokens`);
        return;
    }
    if (!topic) {
        logger.log(`Not provide topic`);
        return;
    }
    return new Promise((resolve, reject) => {
        admin.messaging().subscribeToTopic(tokens, topic)
            .then(function (response) {
                console.log(`Successfully subscribed to topic ${topic}:  ${JSON.stringify(response)}`)
                resolve(`Successfully subscribed to topic ${topic}:  ${JSON.stringify(response)}`);
            })
            .catch(function (error) {
                console.log(`Error subscribing to topic ${topic}: ${error}`)
                reject(`Error subscribing to topic ${topic}: ${error}`);
            });
    })
}

const unsubscribeFromTopic = (tokens, topic) => {
    if (!tokens || !tokens.length) {
        logger.log(`Not provide tokens`);
        return;
    }
    if (!topic) {
        logger.log(`Not provide topic`);
        return;
    }
    return new Promise((resolve, reject) => {
        admin.messaging().unsubscribeFromTopic(tokens, topic)
            .then(function (response) {
                resolve(`Successfully unsubscribed from topic ${topic}: ${JSON.stringify(response)}`);
            })
            .catch(function (error) {
                reject(`Error unsubscribing from topic ${topic}: ${error}`);
            });
    })
}

const sendToTopic = (message, topic) => {
    if (!topic) {
        logger.log(`Not provide topic`);
        return;
    }
    if (!message) {
        logger.log(`Not provide message`);
        return;
    }
    message.topic = topic;
    message = {
        ...message, ...{
            android: {
                notification: {
                    sound: 'default'
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    },
                },
            },
        }
    }
    console.log('MESSAGE TOPIC', { message });
    return new Promise((resolve, reject) => {
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log(`Successfully sent message to topic ${topic}: ${JSON.stringify(response)}`)
                resolve(`Successfully sent message to topic ${topic}: ${JSON.stringify(response)}`);
            })
            .catch((error) => {
                console.log(error);
                reject(`Error sending message to topic ${topic}: ${error}`);
            });
    })
}



module.exports = {
    push,
    subscribeToTopic,
    unsubscribeFromTopic,
    sendToTopic
}