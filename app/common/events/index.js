const events = require("events");
const mailHelper = require("../utils/mail.util");

const eventsEmitter = new events.EventEmitter();
eventsEmitter.on("send-email", mailHelper.send);
module.exports = eventsEmitter;
