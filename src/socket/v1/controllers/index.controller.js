const { getStudent } = require('@skv1/services/index.service');
module.exports = {
    getStudent: (socket) => {
        socket.on('getStudent', getStudent(socket))
    }
}