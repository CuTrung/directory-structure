const express = require('express');
const router = express.Router();
const { getStudent, createStudent, getStudentMongo } = require('@v1/controllers/index.controller');
const { checkLogin, checkVersion } = require('@v1/middlewares/index.middleware');

router.route('/student')
    .get(getStudent)
    .post(createStudent)

router.route('/student/mongo')
    .get(getStudentMongo)



module.exports = router;