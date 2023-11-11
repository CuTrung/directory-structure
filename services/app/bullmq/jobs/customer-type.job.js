const logger = require('../../common/classes/logger.class');
const customerTypeService = require('../../module/customer-type/customer-type.service')

const process = async (type, payload) => {
    if (!type || !payload) return;
    switch (type) {
        case 'customer-type.update':
            return await updateCustomerTypeOfCustomer(payload);
    }
}

const updateCustomerTypeOfCustomer = async (payload = {}) => {
    logger.info(`[care-customer-job:updateCustomerTypeOfCustomer]`);
    try {
       await customerTypeService.updateCustomerTypeOfCustomer()
    } catch (error) {
        logger.error(error, { 'function': 'customer-type-job.updateCustomerTypeOfCustomer' });
    }
}


module.exports = {
    process
}