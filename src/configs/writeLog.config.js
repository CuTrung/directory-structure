const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const pathLog = path.join(__dirname.replace("configs", "api\\v1\\logs"), 'error.log');
const accessLogStream = fs.createWriteStream(pathLog, { flags: 'a' })

const configWriteLog = (app) => {
    app.use(morgan('combined', { stream: accessLogStream }))
}

module.exports = configWriteLog
