const bullmqHelper = require('../common/helpers/bullmq.helper');
const BULLMQCONST = require('../common/const/bullmq.const');
// Jobs
const notification = require('./jobs/notification.job');
// const cube = require('./jobs/cube.job');
const email = require('./jobs/email.job');
const announce = require('./jobs/announce.job');
const news = require('./jobs/news.job');
const auth = require('./jobs/auth.job');
const request = require('./jobs/request.job');
const taskType = require('./jobs/task-type.job');
const preOrder = require('./jobs/pre-order.job');

const process = async (data = {}) => {

    const { type, payload } = data;
    if (!type || !payload) return;
    const jobType = bullmqHelper.getJobType(type);

    if (!jobType) return;
    switch (jobType) {
        case BULLMQCONST.JOB.NOTIFICATION:
            return notification.process(type, payload);
        // case BULLMQCONST.JOB.CUBE:
        //     return cube.process(type, payload);
        case BULLMQCONST.JOB.EMAIL:
            return email.process(type, payload);
        case BULLMQCONST.JOB.ANNOUNCE:
            return announce.process(type, payload);
        case BULLMQCONST.JOB.NEWS:
            return news.process(type, payload);
        case BULLMQCONST.JOB.AUTH:
            return auth.process(type, payload);
        case BULLMQCONST.JOB.CUSTOMERTYPE:
            return customerType.process(type, payload);
        case BULLMQCONST.JOB.REQUEST:
            return request.process(type, payload);
        case BULLMQCONST.JOB.TASKTYPE:
            return taskType.process(type, payload);
        case BULLMQCONST.JOB.PREORDER:
            return preOrder.process(type, payload);
        default:
    }
    return;
}

module.exports = {
    process
}
