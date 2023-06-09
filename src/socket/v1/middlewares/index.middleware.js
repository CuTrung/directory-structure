module.exports = {
    checkLogin: (socket, next) => {
        return next();
    },

    checkAuth: (socket, next) => {
        const { accessToken, refreshToken } = socket.handshake.auth;

        if (accessToken) {
            console.log(">>> accessToken", accessToken);
            next();
        }
        socket.disconnect();
    },
}