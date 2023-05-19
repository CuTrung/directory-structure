const { resFormat } = require("../utils/api.util");

module.exports = {
    checkLogin: (req, res, next) => {
        return next();
    },
    checkVersion: (payload, { defaultVersion } = {}) => (req, res, next) => {
        const version = req.headers['api-version'] || defaultVersion;
        if (!version) {
            console.log(">>> ~ file: index.middleware.js:11 ~ defaultVersion: ", defaultVersion)
            return res.status(500).json(resFormat())
        }
        if (!payload[version]) {
            return res.status(404).json(resFormat({
                message: 'Api version mismatch'
            }))
        }

        return payload[version].call(this, req, res, next);
    }
}