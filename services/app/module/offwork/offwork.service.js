const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');

const update = async () => {
    try {
        const pool = await mssql.pool;
        //load các policy
        const data = await pool.request()
        .input('ISACTIVE', 1)
        .execute('HR_TIMECANOFF_POLICY_GetList_AdminWeb');
        const offworks = data.recordset;
        let respone = offwork.list(offworks)
        // lặp qua lấy block && department && store
        for(let i = 0 ; i < respone.length;i++){
            const res = await pool.request()
            .input('TIMECANOFFPOLICYID',parseInt(respone[i].time_can_off_policy_id))
            .execute('HR_TIMECANOFF_POLICY_GetInfo_AdminWeb')
            const blocks = offwork.block(res.recordsets[0]);
            const departments = offwork.department(res.recordsets[1]);
            const stores = offwork.store(res.recordsets[2]);
            respone[i].blocks = blocks;
            respone[i].departments = departments;
            respone[i].stores = stores;
        }
        for(let i=0 ; i< respone.length;i++){
            const block_list = respone[i].blocks.map((x)=>x.block_id).join('|');
            const department_list = respone[i].blocks.map((x)=>x.department_id).join('|');
            const store_list = respone[i].blocks.map((x)=>x.store_id).join('|');
            const res = await pool.request()
            .input('BLOCKLIST',block_list)
            .input('DEPARTMENTLIST',department_list)
            .input('STORELIST',store_list)
            .input('MONTHLYTIMECANOFF',respone[i].monthly_time_can_off)
            .input('MONTHLYTIMECANOFFUNIT',respone[i].monthly_time_can_off_unit)
            .input('MONTHLYTIMECANOFFCYCLE',respone[i].monthly_time_can_off_cycle)
            .input('SENIORITYTIMECANOFF',respone[i].seniority_time_can_off)
            .input('TIMECANOFFUNIT',respone[i].time_can_off_unit)
            .input('TIMECANOFFCYCLE',respone[i].time_can_off_cycle)
            .input('RESETTIMECANOFFDATE',respone[i].reset_time_can_off_date)
            .input('RESETTIMECANOFFCYCLE',respone[i].reset_time_can_off_cycle)
            .execute('HR_TOTALDAYOFFWORK_UpdateByPolicy_Service')
        }


        logger.info(`UPDATE TOTAL DAY OFFWORK AT ${moment().format('DD/MM/YYYY HH:mm:ss')}`)
    } catch (e) {
        logger.error(e, { 'function': 'OffWorkService.update' });
    }
};

module.exports = {
    update
};
