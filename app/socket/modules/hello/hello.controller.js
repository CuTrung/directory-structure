const { handleTalk } = require("./hello.service");
module.exports = {
  handleTalk: (socket) => {
    socket.on("talk", handleTalk(socket));
  },
};
