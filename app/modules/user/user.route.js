const express = require("express");
const { getUser } = require("./user.rule");
const userController = require("./user.controller");
const validate = require("express-validation");

const routes = express.Router();
const prefix = "/test";

routes.route("").get(validate(getUser), userController.getListUser);

module.exports = {
  prefix,
  routes,
};
