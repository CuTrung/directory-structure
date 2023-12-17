const config = require("../../../config/index.config");
const BULLMQ = require("../../bullmq");

const TOPIC = [config.BULLMQ.TOPIC];

const subscribe = (token, topic = null) => {
  let topic_subscribe = topic
    ? topic instanceof Array
      ? topic
      : [topic]
    : TOPIC;
  for (let i = 0; i < topic_subscribe.length; i++) {
    BULLMQ.push({
      type: "notification.topic.subscribe",
      payload: {
        type: "subscribe",
        topic: topic_subscribe[i],
        tokens: token instanceof Array ? token : [token],
      },
    });
  }
};

const unsubscribe = (token, topic) => {
  for (let i = 0; i < TOPIC.length; i++) {
    BULLMQ.push({
      type: "notification.topic.unsubscribe",
      payload: {
        type: "unsubscribe",
        topic: topic,
        tokens: token instanceof Array ? token : [token],
      },
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
};
