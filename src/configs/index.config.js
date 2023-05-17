module.exports = {
    configCors: (app) => {
        const cors = require('cors');
        const corsOptions = {
            origin: function (origin, callback) {
                if (process.env.WHITE_LIST.includes(origin) || origin === undefined) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            }
        }
        app.use(cors(corsOptions));
    },
    configWriteLog: (app) => {
        const fs = require('fs');
        const morgan = require('morgan');
        const path = require('path');

        const pathLog = path.join(__dirname.replace("configs", "api\\v1\\logs"), 'error.log');
        const accessLogStream = fs.createWriteStream(pathLog, { flags: 'a' })
        app.use(morgan('combined', { stream: accessLogStream }))
    }
}