module.exports = {
    resFormat: ({
        status = 'success',
        message = 'Something wrong on server...',
        data = ''
    }) => ({ status, message, data }),
}