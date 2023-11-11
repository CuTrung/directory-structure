const stringifyError = (error) => {
    const errorJson = JSON.stringify(error, (key, value) => {
        if (value instanceof Error) {
            let error = {};

            Object.getOwnPropertyNames(value).forEach((key) => {
                error[key] = value[key];
            });

            return error;
        }

        return value;
    });

    return errorJson;
};

module.exports = {
    stringifyError,
};
