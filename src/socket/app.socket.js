module.exports = function initSocket(app) {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: WHITE_LIST,
    },
  });

  // init routes
  require("./index.routes")(io);

  console.log(">>> Connect Socket success");
  return server;
};
