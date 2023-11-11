const cron = require('node-cron');
const BULLMQQUEUE = require('../bullmq/queue');
const OffWorkService = require('../module/offwork/offwork.service');
const ReceiveslipService = require('../module/receiveslip/receiveslip.service');
const PaymentslipService = require('../module/paymentslip/paymentslip.service');
const PreOrderService = require('../module/pre-order/pre-order.service');

// Scan announce and news every minute
cron.schedule('0 * * * * *', async () => {//8-23
    try {
        BULLMQQUEUE.add({ type: 'announce.scan', payload: { run: true } });
        BULLMQQUEUE.add({ type: 'news.scan', payload: { run: true } });
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();


// Update time off
cron.schedule('0 10 0 15 * *', async () => {//8-23
    try {
        OffWorkService.update();
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();

// Tao phieu thu tu dong
cron.schedule('0 29 2 * * *', async () => {//8-23
    try {
        ReceiveslipService.create();
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();


cron.schedule('0 20 2 * * *', async () => {//8-23
    try {
        PaymentslipService.create();
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();

// chạy job update hạng KH khi cuối ngày
cron.schedule('58 23 * * *', async () => {
    try {
       BULLMQQUEUE.add({type: 'customer-type.update', payload: { run: true}})
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();

// chạy job create email/sms 18h hằng ngày:
cron.schedule('0 18 * * *', async () => {
    try {
       BULLMQQUEUE.add({type: 'task-type.createSendEmailSMS', payload: { run: true}})
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();

// */10 * * * * *: every 10s
// chạy job lên lịch gửi sms nhắc nhở thanh toán vào cuối ngày
cron.schedule('55 23 * * *', async () => {
    try {
      await PreOrderService.getListAndUpdateJobs();
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();

// chạy job reset ngày nghỉ của nhân viên vào cuối năm
cron.schedule('59 23 31 12 *', async () => {//23:59 ngày 31 tháng 12 hàng năm
    try {
        await OffWorkService.reset();
    } catch (error) {
        logger.error(error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
}).start();
