// const database = require('../../models');
const ServiceResponse = require("../../common/responses/service.response");
const _ = require("lodash");
const { getValue } = require("../../common/utils/object.util");
const { execQuery } = require("../../common/utils/sql/pg.util");

const getListUser = async (body = {}) => {
  try {
    const res = await execQuery("SELECT * FROM accounts");
    return new ServiceResponse(true, "Lấy danh sách thành công", res.rows);
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
