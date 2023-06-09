
const { getStudent } = require('@skv1/controllers/index.controller');
const { checkLogin, checkAuth } = require('@skv1/middlewares/index.middleware');

module.exports = {
    initRoutesSocket: (io) => {
        // Ko check route '/'
        io.of(/.*/).use(checkAuth);
        io.of('/student').use(checkLogin).on('connection', getStudent)

    }
}