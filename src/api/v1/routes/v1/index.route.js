const express = require('express');
const { getStudent, createStudent } = require('../../controllers/index.controller');
const { checkLogin } = require('../../middlewares/index.middleware');
const router = express.Router();

router.route('/students')
    .get(checkLogin, getStudent)
    .post(createStudent)

module.exports = router;
