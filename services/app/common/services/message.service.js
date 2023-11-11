var admin = require('firebase-admin');
const logger = require('../classes/logger.class');
const config = require('../../../config/config');

var serviceAccount = require('../../../config/' + config.firebase.SDK);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.URL,
});

const send = (notification, token, data) => {
  logger.info(`${JSON.stringify({ notification, token, data })}`);
  if (!token) return;
  if (token == 'xxx') return;
  if (token.indexOf('"') >= 0) return;
  //   let message = { data };
  //   if (notification) message = { ...message, ...{ notification: { ...notification, ...{ sound: 'default' } } } };
  //   const options = {
  //     priority: 'high',
  //     contentAvailable: true, //wakes up iOS
  //   };
  token = token instanceof Array ? token : [token];
  return new Promise((resolve, reject) => {
    admin
      .messaging()
      //   .sendToDevice(token, message, options)
      .sendEachForMulticast({
        notification,
        tokens: token,
        data,
      })
      .then((response) => {
        resolve(response.successCount + ' messages were sent successfully');
      })
      .catch((e) => {
        logger.error(e, { function: 'messageService.send' });
        reject(e);
      });
  });
};

module.exports = {
  send,
  admin,
};
