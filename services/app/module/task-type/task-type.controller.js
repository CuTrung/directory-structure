const taskTypeService = require('./task-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const optionsService = require('../../common/services/options.service');

const updateTaskTypeCron = async (req, res, next) => {
  try {
    const serviceRes = await taskTypeService.updateTaskTypeCron(req.body);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateTaskTypeCron,
};
