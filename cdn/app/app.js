const logger = require('morgan');
const cors = require('cors');
const express = require("express");
const useragent = require('express-useragent');
const path = require('path');
const helmet = require('helmet');
const config = require('../config/config');
const pageNotFoundMiddleware = require('./middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware');
const initRoutes = require("./routes");

const init = (app) => {
    if (config.env === 'development') {
        app.use(logger('dev'));
    }
    // parse body params and attache them to req.body

    app.use(express.urlencoded({ extended: true }));

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    // parse information user agent
    app.use(useragent.express());

    // Static file     
    app.use(express.static(path.join(__dirname, '../storage'), { index: false }));

    // check api key middlware 
    app.use(require('./middlewares/check-apikey.middleware'));

    // mount all routes on /api path
    initRoutes(app);

    // catch 404 and forward to error handler
    app.use(pageNotFoundMiddleware());

    // error handler
    app.use(errorHandlerMiddleware());

    app.listen(config.port, () => {
        console.info(`CDN server started on port ${config.port} (${config.env})`);
    });

    return app;
};

module.exports = init;
