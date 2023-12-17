// const database = require('../../models');
const ServiceResponse = require("../../common/responses/service.response");
const _ = require("lodash");
const { execProcedure, transaction } = require("../../common/utils/db.util");
const { getValue } = require("../../common/utils/object.util");

const getListUser = async (body = {}) => {
  try {
    const dataRecord = await execProcedure("test", {
      my_name: getValue(body, "my_name", 2),
    });
    return new ServiceResponse(
      true,
      "Lấy danh sách thành công",
      dataRecord.recordset,
    );
  } catch (error) {
    return new ServiceResponse(
      false,
      error.message ?? "Lấy danh sách thất bại",
      error,
    );
  }
};

const getListUserTransaction = async (body = {}) => {
  try {
    const data = await transaction(async (reqTrans) => {
      const dataDel = await execProcedure(
        "deleteUsers",
        {
          age: getValue(body, "age", 2),
        },
        reqTrans,
      );

      const dataCreated = await execProcedure(
        "createUsers",
        {
          age: getValue(body, "age", 9),
        },
        reqTrans,
      );

      // if (true) {
      //     throw Error('lỗi rồi em ơi');
      // }

      return true;
    });

    return new ServiceResponse(true, "Test trans", data);
  } catch (error) {
    return new ServiceResponse(
      false,
      error.message ?? "Lấy danh sách thất bại",
      error,
    );
  }
};

module.exports = {
  getListUser,
  getListUserTransaction,
};
