const NewsService = require("../../module/news/news.service");
const logger = require("../../common/classes/logger.class");
const { pushTopic } = require("../../common/services/notification.service");

const process = async (type, payload) => {
    if (!type || !payload) return;
    switch (type) {
        case "news.scan":
            return await scanNews(payload);
    }
};

// Scan news
const scanNews = async (payload = {}) => {
    logger.info(`[news-job:scanNews]`);
    try {
        const notifications = await NewsService.scan();
        console.log({ notifications });
        for (let i = 0; i < notifications.length; i++) {
            const { notification, data } = notifications[i];
            pushTopic({ notification, data });
        }
    } catch (error) {
        logger.error(error, { function: "notification-job.scanNews" });
    }
};

module.exports = {
    process,
};
