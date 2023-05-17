const { hashSync, genSaltSync } = require('bcryptjs');
const { TokenExpiredError, sign, verify } = require('jsonwebtoken');

module.exports = {
    hashString: (str) => hashSync(str, genSaltSync(10)),
    compareHashString: (str, hashStr) => compareSync(str, hashStr),
    createToken: (payload, expiresIn) => {
        let token;
        try {
            token = sign(payload, process.env.SECRET_KEY_JWT, { noTimestamp: true, expiresIn });
        } catch (error) {
            console.log(error)
        }
        return token;
    },
    verifyToken: (token) => {
        let decoded = null;
        try {
            decoded = verify(token, process.env.SECRET_KEY_JWT);
        } catch (error) {
            console.log(error)
            if (error instanceof TokenExpiredError) {
                decoded = error
            }
        }
        return decoded;
    }
}

