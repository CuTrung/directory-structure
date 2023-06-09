module.exports = {
    configCors: (app) => {
        const cors = require('cors');
        const corsOptions = {
            // Accept cookie
            credentials: true,
            origin: function (origin, callback) {
                if (JSON.parse(process.env.WHITE_LIST).includes(origin) || origin === undefined) {
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
        if (app.get('env') == 'production') {
            app.use(morgan('common', { skip: (req, res) => res.statusCode < 400, stream: accessLogStream }));
        } else {
            app.use(morgan('short', { stream: accessLogStream }));
        }
    }
}