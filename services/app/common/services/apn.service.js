const apn = require('apn');
const logger = require('../classes/logger.class');
const fs = require('fs');
const appRoot = require('app-root-path');



const push = (payload) => {
    const { token, data } = payload;
    const config = {
        token: {
            key: appRoot + '/config/AuthKey_FR4F75Z67B.p8', ///AuthKey_4584C9A7TA
            keyId: "FR4F75Z67B", // 4584C9A7TA
            teamId: "Q6292RMBY6" ///D4577C6AW3
        },
        production: payload.production || false
    };

    const apnProvider = new apn.Provider(config);
    let notification = new apn.Notification();

    notification.expiry = Math.floor(Date.now() / 1000) + 60; // Expires 1 minute from now.
    notification.badge = 3;
    notification.payload = data;
    notification.topic = "com.ltd.daiducviet.findfriendslike.voip";//"com.daiducviet.findfriend.voip";
    notification.priority = 5;
    notification.pushType = "background";

    logger.info(`BODY : ${JSON.stringify(notification)}`)

    return new Promise((resolve, reject) => {
        apnProvider.send(notification, [apn.token(token)])
            .then((response) => {
                // console.log(JSON.stringify(response));
                if (response.sent.length) {
                    logger.info(`push apn success full with token ${token}`)
                    return resolve(response)
                }
                reject(response.failed.toString())
            }).catch((error) => reject(error))
    })
}

module.exports = { push }