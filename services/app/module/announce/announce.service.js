const PROCEDURE_NAME = require("../../common/const/procedure-name.const");
const mssql = require("../../models/mssql");
const logger = require("../../common/classes/logger.class");

const scan = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute(PROCEDURE_NAME.SYS_ANNOUNCE_GETLISTTOPUSH_SERVICE);
    if (!data.recordset.length) return [];
    const announces = data.recordset || [];

    let notifications = [];
    for (let i = 0; i < announces.length; i++) {
      const {
        ISPUSHTOALL: isPushAll = 0,
        ANNOUNCETITLE: title = "",
        DESCRIPTION: body = "",
        ANNOUNCEID: id = 0,
      } = announces[i];
      let notification = {
        all: 1,
        notification: {
          title,
          body,
        },
        data: {
          id: `${id}`.toString(),
          key: "ANNOUNCE",
        },
      };
      if (!isPushAll) {
        notification.all = 0;
        // get token to push
        const tokenReq = await pool
          .request()
          .input("ANNOUNCEID", id)
          .execute(PROCEDURE_NAME.SYS_ANNOUNCE_GETDETAILTOPUSH_SERVICE);
        if (tokenReq.recordset.length) {
          notification.tokens = (tokenReq.recordset || []).map((token) => token.DEVICETOKEN);
        }
      }
      notifications.push(notification);
    }
    return notifications;
  } catch (e) {
    logger.error(e, { function: "announce.scan" });
    return null;
  }
};
const detail = async (annouce_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("ANNOUNCEID", annouce_id)
      .execute("SYS_ANNOUNCE_GetById_Service");
    if (!data.recordset || !data.recordset.length) return null;
    const announces = data.recordet[0] || {};

    if (announces) {
      const {
        ISPUSHTOALL: isPushAll = 0,
        ANNOUNCETITLE: title = "",
        DESCRIPTION: body = "",
        ANNOUNCEID: id = 0,
      } = announces[0];
      let notification = {
        all: 1,
        notification: {
          title,
          body,
        },
        data: {
          id: `${id}`.toString(),
          key: "ANNOUNCE",
        },
      };
      if (!isPushAll) {
        notification.all = 0;
        // get token to push
        const tokenReq = await pool
          .request()
          .input("ANNOUNCEID", id)
          .execute(PROCEDURE_NAME.SYS_ANNOUNCE_GETDETAILTOPUSH_SERVICE);
         
        if (tokenReq.recordset.length) {
          notification.tokens = (tokenReq.recordset || []).map((token) => token.DEVICETOKEN);
        }
      }
      return notification;
    }
  } catch (e) {
    logger.error(e, { function: "announce.detail" });
    return null;
  }
};
const update = async (announceId) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input("ANNOUNCEID", announceId)
      .execute(PROCEDURE_NAME.SYS_ANNOUNCE_UPDATETOPUSH_SERVICE);
    logger.info(`UPDATE ${announceId} successfully !!!`);
  } catch (e) {
    logger.error(e, { function: "announce.update" });
    return null;
  }
};

module.exports = {
  scan,
  update,
  detail,
};
