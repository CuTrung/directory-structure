const express = require('express');
const validate = require('express-validation');
const rules = require('./task-type.rule');
const taskTypeController = require('./task-type.controller');
const routes = express.Router();
const prefix = '/task-type';

routes.route('')
  .post(taskTypeController.updateTaskTypeCron)


module.exports = {
  prefix,
  routes,
};
