const { initRoutesSocket } = require('@skv1/routes/index.route');

module.exports = initSocketServer = (app) => {
    const server = require('http').createServer(app);
    const io = require('socket.io')(server, {
        cors: {
            origin: JSON.parse(process.env.WHITE_LIST_SOCKET)
        },
    });
    initRoutesSocket(io);
    console.log(">>> Connect Socket success");
    return server;
}
