
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');

const updateCustomerTypeOfCustomer = async (params = {}) => {

    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .execute("CRM_ACCOUNT_GetListCustomerUpdateType_Service");
        return true || null;
    } catch (e) {

        logger.error(e, { 'function': 'customer-type.updateCustomerTypeOfCustomer' });
        return null;
    }
};

module.exports = {
    updateCustomerTypeOfCustomer,
};
