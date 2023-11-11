const paymentslipClass = require('./paymentslip.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const MailService = require('../../common/services/mail.service');
const { CurrencyUnitPrice } = require('../../common/helpers/numberFormat');

const detail = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PAYMENTSLIPID', apiHelper.getValueFromObject(queryParams, 'paymentslip_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_PAYMENTSLIP_GetById_Service');
        let paymentslip = paymentslipClass.detail(data.recordset[0]);
        if (paymentslip && paymentslip.paymentslip_id) {

            paymentslip.expend_type = paymentslipClass.expendType(data.recordsets[1][0])
            paymentslip.review_list = paymentslipClass.reviewList(data.recordsets[2])
            const users = paymentslipClass.reviewUsers(data.recordsets[3]);
            if (users && users.length) {
                paymentslip.review_list = (paymentslip.review_list || []).map((x) => {
                    return {
                        ...x,
                        users: users.filter((u) => u.review_level_id == x.review_level_id)
                    }
                })
            }
            if (paymentslip.is_review == 2 && (paymentslip.review_list || []).filter((x) => !x.is_auto_review && x.review_date).length) {
                paymentslip.is_review = 3 // dang duyet 
            }

            return new ServiceResponse(true, '', paymentslip);
        }
        return new ServiceResponse(false, 'Không tìm thấy phiếu CHI.')
    } catch (e) {
        logger.error(e, { 'function': 'paymentslipService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const create = async () => {
    try {
        console.log('run')
        const pool = await mssql.pool;
        const data = await pool.request()
            .execute('SL_PAYMENTSLIP_Create_Service');
        const paymentslipIds = data.recordset;
        if (paymentslipIds && paymentslipIds.length) {
            for (let i = 0; i < paymentslipIds.length; i++) {
                // Lay thong tin phieu thu
                const { ID: paymentslip_id, USERNAME } = paymentslipIds[i];
                const serviceDetailRes = await detail({ auth_name: 'administrator', paymentslip_id });
                if (serviceDetailRes.isFailed()) {
                    return next(serviceDetailRes);
                }
                // Lấy thông tin duyệt 
                let mail = serviceDetailRes.getData();
                if (mail.total_money) mail.total_money_text = CurrencyUnitPrice(mail.total_money)
                const users = (mail.review_list || [])
                    .filter((x) => !x.is_auto_review && !x.review_date)
                    .map((x) => ({ ...x, user_name: x.review_user }))
                mail.review_link = `/payment-slip/detail/${paymentslip_id}`
                if (users && users.length) {
                    mail.users = [users[0]];
                }
                // Gửi thôgn tin duyệt
                if (mail.users && mail.users.length) {
                    await MailService.sendToInside(mail, 'PAYMENTSLIP', `[DUYỆT PHIẾU CHI] ${mail.paymentslip_code}`);
                }
                // Gui thông báo 
                if (USERNAME) {
                    mail.users = [{
                        user_name: USERNAME
                    }]
                    mail.is_review = 0
                    await MailService.sendToInside(mail, 'PAYMENTSLIP');
                }
            }
        }
        console.log(`Create ${paymentslipIds.length} receveslip auto completed.`);
        logger.info(`Create ${paymentslipIds.length} receveslip auto completed.`)
    } catch (error) {
        console.log(error);
        logger.error(error, { 'paymentslip': 'paymentslipService.create' });
    }
};


module.exports = {
    detail,
    create,
};
