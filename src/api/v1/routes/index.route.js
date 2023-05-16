const routerV1 = require('./v1/index.route');

const initRoutes = (app) => {
    app.use('/api/v1', routerV1);
}

module.exports = {
    initRoutes
}