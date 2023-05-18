const express = require('express');
const { getStudent, createStudent, getStudentMongo } = require('../../controllers/index.controller');
const { checkLogin } = require('../../middlewares/index.middleware');
const router = express.Router();

router.route('/students')
    .get(checkLogin, getStudent)
    .post(createStudent)

router.route('/students/mongo')
    .get(getStudentMongo)

module.exports = router;
