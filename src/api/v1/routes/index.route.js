const routerV1 = require('./v1/index.route');

module.exports = {
    initRoutes: (app) => {
        app.use('/api/v1', routerV1);
    }
}