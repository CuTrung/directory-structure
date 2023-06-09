const SERVICE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
}
module.exports = {
    SERVICE_STATUS,
    serviceResult: ({
        status = SERVICE_STATUS.ERROR,
        message = 'Something wrong on server...',
        data = ''
    } = {}) => ({ status, message, data }),
    delay: async (time = 500) => new Promise((resolve) => setTimeout(() => resolve(), time))
}