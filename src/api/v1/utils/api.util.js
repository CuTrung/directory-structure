module.exports = {
    resFormat: ({
        status = 'success',
        message = 'Something wrong on server...',
        data = ''
    }) => ({ status, message, data }),
    delay: async (time = 500) => new Promise((resolve) => setTimeout(() => resolve(), time))
}