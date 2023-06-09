const { serviceResult } = require("@v1/utils/api.util");
const { formatDate } = require("@v1/utils/index.util");

const nonSecureAuthPaths = ['/auth/login', '/auth/register'];
module.exports = {
    checkJWT: (req, res, next) => {
        if (nonSecureAuthPaths.includes(req.path))
            return next();

        next();
    },
    checkVersion: (payload, { defaultVersion } = {}) => (req, res, next) => {
        const version = req.headers['api-version'] || defaultVersion;
        if (!version) {
            console.log(">>> ~ file: index.middleware.js:11 ~ defaultVersion: ", defaultVersion)
            return res.status(500).json(serviceResult())
        }
        if (!payload[version]) {
            return res.status(404).json(serviceResult({
                message: 'Api version mismatch'
            }))
        }

        return payload[version].call(this, req, res, next);
    },
    checkInfoClient: (req, res, next) => {
        const { _startTime, headers: { host }, ip, path, protocol, baseUrl } = req;
        const userAgent = req.headers['user-agent']
        const url = protocol + '://' + host + baseUrl;
        console.log(">>> Check", formatDate(_startTime));
    }
}