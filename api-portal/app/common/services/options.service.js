const mssql = require('../../models/mssql');
const OptionsClass = require('./options.class');
const ServiceResponse = require('../responses/service.response');
const apiHelper = require('../utils/api.util');
// const PROCEDURE_NAME = require('../const/procedureName.const');
const cache = require('../classes/cache.class');
const API_CONST = require('../const/api.const');
const _ = require('lodash');
const logger = require('../classes/logger.class');

const getOptions = async function (tableName, queryParams = {}) {
    try {
        const company_id = apiHelper.getValueFromObject(queryParams, 'company_id');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TableName', tableName)
            .input('COMPANYID', company_id ? company_id : null)
            .input('ISACTIVE', API_CONST.ISACTIVE.ALL)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('LIMIT', apiHelper.getValueFromObject(queryParams, 'limit', 100))
            .execute(PROCEDURE_NAME.CBO_COMMON_GETALL);
        return data.recordset;
    } catch (e) {
        logger.error(e, { function: 'OptionService.getOptions' });

        return [];
    }
};

/**
 *
 * @param tableName
 * @param queryParams
 * @returns {Promise<ServiceResponse>}
 */
module.exports = async function optionService(tableName, queryParams) {
    try {
        // Get parameter
        let ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
        const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
        const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
        // Get data from cache
        // const data = await cache.wrap(`${tableName}_OPTIONS`, () => {
        //   return getOptions(tableName);
        // });
        const data = await getOptions(tableName, queryParams);

        // Filter values: empty, null, undefined
        const idsFilter = ids.filter((item) => {
            return item;
        });
        const dataFilter = _.filter(data, (item) => {
            let isFilter = true;
            if (Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
                isFilter = false;
            }
            if (idsFilter.length && !idsFilter.includes(item.ID.toString())) {
                isFilter = false;
            }
            if (parentId && Number(parentId) !== Number(item.PARENTID)) {
                isFilter = false;
            }

            if (isFilter) {
                return item;
            }

            return null;
        });
        return new ServiceResponse(true, '', OptionsClass.options(dataFilter));
    } catch (e) {
        logger.error(e, { function: 'OptionService.getOptions' });

        return new ServiceResponse(false, '', []);
    }
};
