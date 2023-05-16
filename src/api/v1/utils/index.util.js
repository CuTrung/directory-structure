const resFormat = (errorCode = -1, errorMessage, data = '') => {
    return {
        EC: errorCode,
        EM: errorMessage ?? 'Something wrong on server...',
        DT: data
    }
}

const resStatusJson = (res, numberCode, data) => {
    return res.status(numberCode).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    });
}


module.exports = {
    resFormat, resStatusJson
}