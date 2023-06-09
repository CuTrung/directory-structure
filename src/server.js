


module.exports = initServer = (app) => {
    require('module-alias/register');
    const { initRoutes } = require('@v1/routes/index.route');
    const { configWriteLog, configCors } = require('@src/configs/index.config');
    const { connectMySQL, connectMongoDB, connectRedis } = require('@src/configs/db.config');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');

    connectMySQL({
        host: process.env.DB_MYSQL_HOST,
        user: process.env.DB_MYSQL_USER,
        password: process.env.DB_MYSQL_PASSWORD,
        database: process.env.DB_MYSQL_NAME,
    })

    // connectMongoDB({
    //     host: process.env.DB_HOST,
    //     database: process.env.DB_NAME,
    // })

    // connectRedis();

    //  Trả về req.ip thực kể cả khi dùng proxy
    app.set('trust proxy', true);
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Write error.log with morgan
    // configWriteLog(app);
    configCors(app);
    initRoutes(app);

    // Use socket in project
    // app = require('../src/socket/server.socket')(app);

    return app;
}











