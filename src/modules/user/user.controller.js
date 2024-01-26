const userService = require("./user.service");
const { formatResponse, TYPES_RES } = require("../../common/utils/api.util");
const logger = require("../../common/utils/logger.util");

const getListUser = async (req, res, next) => {
  try {
    const users = await userService.getListUser(req.body);
    return formatResponse(users).send(res);
  } catch (error) {
    logger.error(error, { function: "auth.service.createToken" });
    return formatResponse(error).send(res);
  }
};

module.exports = {
  getListUser,
};
