const express = require('express');
const router = express.Router();
const studentRouteV1 = require('./student/student.route.v1');
const { checkVersion } = require('../../middlewares/index.middleware');

router.route('/student*')
    .all(checkVersion({
        '2023-05-19': studentRouteV1
    }, { defaultVersion: '2023-05-19' }))


module.exports = router;
