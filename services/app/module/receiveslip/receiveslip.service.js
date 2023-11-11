const receiveslipClass = require('./receiveslip.class');
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
            .input('RECEIVESLIPID', apiHelper.getValueFromObject(queryParams, 'receiveslip_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_RECEIVESLIP_GetById_Service');
        let receiveslip = receiveslipClass.detail(data.recordset[0]);
        if (receiveslip && receiveslip.receiveslip_id) {

            receiveslip.receive_type = receiveslipClass.receiveType(data.recordsets[1][0])
            receiveslip.review_list = receiveslipClass.reviewList(data.recordsets[2])
            const users = receiveslipClass.reviewUsers(data.recordsets[3]);
            if (users && users.length) {
                receiveslip.review_list = (receiveslip.review_list || []).map((x) => {
                    return {
                        ...x,
                        users: users.filter((u) => u.review_level_id == x.review_level_id)
                    }
                })
            }
            if (receiveslip.is_review == 2 && (receiveslip.review_list || []).filter((x) => !x.is_auto_review && x.review_date).length) {
                receiveslip.is_review = 3 // dang duyet 
            }

            return new ServiceResponse(true, '', receiveslip);
        }
        return new ServiceResponse(false, 'Không tìm thấy phiếu thu.')
    } catch (e) {
        logger.error(e, { 'function': 'receiveslipService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const create = async () => {
    try {
        console.log('run')
        const pool = await mssql.pool;
        const data = await pool.request()
            .execute('SL_RECEIVESLIP_Create_Service');
        const receiveslipIds = data.recordset;
        if (receiveslipIds && receiveslipIds.length) {
            for (let i = 0; i < receiveslipIds.length; i++) {
                // Lay thong tin phieu thu
                const { ID: receiveslip_id, USERNAME } = receiveslipIds[i];
                const serviceDetailRes = await detail({ auth_name: 'administrator', receiveslip_id });
                if (serviceDetailRes.isFailed()) {
                    return next(serviceDetailRes);
                }
                // Lấy thông tin duyệt 
                let mail = serviceDetailRes.getData();
                if (mail.total_money) mail.total_money_text = CurrencyUnitPrice(mail.total_money)
                const users = (mail.review_list || [])
                    .filter((x) => !x.is_auto_review && !x.review_date)
                    .map((x) => ({ ...x, user_name: x.review_user }))
                mail.review_link = `/receiveslip/detail/${receiveslip_id}`
                if (users && users.length) {
                    mail.users = [users[0]];
                }
                // Gửi thôgn tin duyệt
                if (mail.users && mail.users.length) {
                    await MailService.sendToInside(mail, 'RECEIVESLIP', `[DUYỆT PHIẾU THU] ${mail.receiveslip_code}`);
                }
                // Gui thông báo 
                if (USERNAME) {
                    mail.users = [{
                        user_name: USERNAME
                    }]
                    mail.is_review = 0
                    await MailService.sendToInside(mail, 'RECEIVESLIP');
                }
            }
        }
        console.log(`Create ${receiveslipIds.length} receveslip auto completed.`);
        logger.info(`Create ${receiveslipIds.length} receveslip auto completed.`)
    } catch (error) {
        console.log(error);
        logger.error(error, { 'receiveslip': 'receiveslipService.create' });
    }
};


module.exports = {
    detail,
    create,
};
