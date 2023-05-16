const cors = require('cors');
const corsOptions = {
    origin: function (origin, callback) {
        if (process.env.WHILE_LIST.includes(origin) || origin === undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const configCors = (app) => {
    app.use(cors(corsOptions));
}

module.exports = configCors