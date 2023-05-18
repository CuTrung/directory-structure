const RES_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
}
module.exports = {
    RES_STATUS,
    resFormat: ({
        status = RES_STATUS.SUCCESS,
        message = 'Something wrong on server...',
        data = ''
    }) => ({ status, message, data }),
    delay: async (time = 500) => new Promise((resolve) => setTimeout(() => resolve(), time))
}