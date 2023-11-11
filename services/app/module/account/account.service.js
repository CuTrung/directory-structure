const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');

const update = async (params = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('MEMBERID', apiHelper.getValueFromObject(params, 'member_id'))
      .input('CUBEID', apiHelper.getValueFromObject(params, 'cube_id'))
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_UPDATECONNECTYCUBE_SERVICE);
    logger.info(`update success: ${JSON.stringify(params)} ... `)
    if(!data.recordset.length) return null;
    const { DEVICETOKEN = null } = data.recordset[0];
    // Convert value to string
    for (key in params) {
      params[key] = `${params[key]}`;
    };
    return {token: DEVICETOKEN, data: {...params, ...{key: 'CONNECTYCUBE'}}};
  } catch (e) {
    logger.error(e, {'function': 'account.update'});
    return null; 
  }
};

module.exports = {
  update,
};
