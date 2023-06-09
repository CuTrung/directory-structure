module.exports = {
    getStudent: (socket) => {
        return async ({ body }, sendResult) => {
            console.log(">>> check ", body);
            sendResult({ mess: 'Get body success' })
        }
    }
}