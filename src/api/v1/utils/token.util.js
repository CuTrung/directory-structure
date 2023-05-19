const { hashSync, genSaltSync } = require('bcryptjs');
const { TokenExpiredError, sign, verify } = require('jsonwebtoken');
const crypto = require('node:crypto');
const { formatDate, typeOf } = require('./index.util');
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // độ mạnh của key
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
});


// Save publicKey to DB, khi user gửi request đến thì decode phần payload của JWT (Sử dụng Buffer để decode base64) để lấy ra userId, sau đó select trong DB để lấy publicKey rồi mới verify để xem hợp lệ hay không.

const that = module.exports = {
    hashString: (str) => hashSync(str, genSaltSync(10)),
    compareHashString: (str, hashStr) => compareSync(str, hashStr),
    createJWTToken: (payload, expiresIn = '1d') => {
        let token;
        try {
            token = sign(payload, privateKey, {
                expiresIn,
                algorithm: 'RS256'
            });
        } catch (error) {
            console.log(error)
        }
        return token ? { token, publicKey } : token;
    },
    verifyJWTToken: (token, publicKey) => {
        let decoded;
        try {
            const { iat, exp, ...data } = verify(token, publicKey);
            decoded = {
                ...data,
                createdAt: formatDate(new Date(iat * 1000)),
                expiredAt: formatDate(new Date(exp * 1000))
            };
        } catch (error) {
            console.log(error)
            if (error instanceof TokenExpiredError) {
                decoded = { expiredAt: formatDate(new Date(error.expiredAt)) }
            }
        }
        return decoded;
    },
    getPayloadJWTToken: (token) => {
        const payloadBase64 = that.decodeBase64(token);
        const start = payloadBase64.indexOf("}") + 1;
        const end = payloadBase64.indexOf("}", payloadBase64.indexOf("exp", start)) + 1;
        const { iat, exp, ...payload } = JSON.parse(payloadBase64.slice(start, end));
        return payload;
    },
    decodeBase64: (strBase64) => Buffer.from(strBase64, 'base64').toString('utf-8'),
    encodeBase64: (value) => Buffer.from(JSON.stringify(value), 'utf-8').toString('base64')
}

