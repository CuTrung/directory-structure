const AnnounceService = require('../../module/announce/announce.service');
const logger = require('../../common/classes/logger.class');
const { pushNotification, pushTopic } = require('../../common/services/notification.service');
const config = require('../../../config/config');

const process = async (type, payload) => {
  if (!type || !payload) return;
  switch (type) {
    case 'announce.scan':
      return await scanAnnounce(payload);
    case 'announce.push':
      return await detailAnnounce(payload);
  }
};
// detail announce
const detailAnnounce = async (payload = {}) => {
  logger.info(`[announce-job:scanAnnounce]`);
  try {
    const notifications = await AnnounceService.detail(payload.announceId);
    if (notifications) {
      const { all, notification, data, tokens = [] } = notifications;
      if (1 * all === 1) {
        // push topic
        pushTopic({ notification, data });
      } else {
        pushNotification({
          notification,
          data,
          token: tokens,
        });
      }
      // update pushed
      await AnnounceService.update(data.id);
    }
  } catch (error) {
    logger.error(error, { function: 'notification-job.detailAnnounce' });
  }
};

// Scan announce
const scanAnnounce = async (payload = {}) => {
  console.log(`[announce-job:scanAnnounce]`);
  try {
    const notifications = await AnnounceService.scan();
    console.log('announce', JSON.stringify(notifications));
    for (let i = 0; i < notifications.length; i++) {
      const { all, notification, data, tokens = [] } = notifications[i];
      if (1 * all === 1) {
        // push topic
        pushTopic({ notification, data });
        console.log(`push topic `);
      } else {
        pushNotification({
          notification,
          data,
          token: tokens,
        });
      }
      // update pushed
      await AnnounceService.update(data.id);
    }
  } catch (error) {
    logger.error(error, { function: 'notification-job.scanAnnounce' });
  }
};

module.exports = {
  process,
};
