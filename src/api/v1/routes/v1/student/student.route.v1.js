const express = require('express');
const router = express.Router();
const { getStudent, createStudent, getStudentMongo } = require('../../../controllers/index.controller');
const { checkLogin, checkVersion } = require('../../../middlewares/index.middleware');

router.route('/student')
    .get(getStudent)
    .post(createStudent)

router.route('/student/mongo')
    .get(getStudentMongo)



module.exports = router;