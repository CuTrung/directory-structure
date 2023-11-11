const mssql = require("../../models/mssql");
const logger = require("../../common/classes/logger.class");

const update = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input("EVENTID", params.event_id)
            .input('CUSTOMERID', params.customer_id)
            .execute('EM_EVENT_PARTICIPANT_Update_Service');
        logger.info(`UPDATE ${params.event_id} successfully !!!`);
    } catch (e) {
        logger.error(e, { function: "event.update" });
        return null;
    }
};

module.exports = {
    update,
};
