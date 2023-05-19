const { checkVersion } = require('@v1/middlewares/index.middleware');
const routerV1 = require('@v1/routes/v1/index.route');
module.exports = {
    initRoutes: (app) => {
        app.use('/api', checkVersion({
            '2023-05-19': routerV1
        }, { defaultVersion: '2023-05-19' }));
    }
}