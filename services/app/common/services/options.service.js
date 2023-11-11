const mssql = require('../../models/mssql');
const OptionsClass = require('./options.class');
const ServiceResponse = require('../responses/service.response');
const apiHelper = require('../helpers/api.helper');
const PROCEDURE_NAME = require('../const/procedure-name.const');
const cache = require('../classes/cache.class');
const API_CONST = require('../const/api.const');
const _ = require('lodash');
const logger = require('../classes/logger.class');

const getOptions = async function (tableName) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('TableName', tableName)
            .input('ISACTIVE', API_CONST.ISACTIVE.ALL)
            .execute(PROCEDURE_NAME.CBO_COMMON_GETALL);

        return data.recordset;
    } catch (e) {
        logger.error(e, { 'function': 'OptionService.getOptions' });

        return [];
    }
};

/**
 *
 * @param tableName
 * @param queryParams
 * @returns {Promise<ServiceResponse>}
 */
module.exports = async function (tableName, queryParams) {
    try {
        // Get parameter
        const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
        const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
        const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
        const isFilterParent = apiHelper.getValueFromObject(queryParams, 'is_filter_parent');
        // Get data from cache
        // const data = await cache.wrap(`${tableName}_OPTIONS`, () => {
        //   return getOptions(tableName);
        // });
        const data = await getOptions(tableName);
        // Filter values: empty, null, undefined
        const idsFilter = ids.filter((item) => { return item; });
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
            if (isFilterParent && idsFilter.length && idsFilter.includes(item.PARENTID.toString())) {
                isFilter = true;
            }
            if (isFilter) {
                return item;
            }

            return null;
        });
        return new ServiceResponse(true, '', OptionsClass.options(dataFilter));
    } catch (e) {
        logger.error(e, { 'function': 'OptionService.getOptions' });

        return new ServiceResponse(true, '', []);
    }
};
