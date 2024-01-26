const { TokenExpiredError, sign, verify } = require("jsonwebtoken");
const { formatDate } = require("./datetime.util");

// Save publicKey to DB, khi user gửi request đến thì decode phần payload của JWT (Sử dụng Buffer để decode base64) để lấy ra userId, sau đó select trong DB để lấy publicKey rồi mới verify để xem hợp lệ hay không.

const that = (module.exports = {
  createRSAKeyPair: () =>
    require("node:crypto").generateKeyPairSync("rsa", {
      modulusLength: 2048, // độ mạnh của key
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    }),
  createJWT: (payload, expiresIn = "1d") => {
    const { privateKey, publicKey } = that.createRSAKeyPair();
    let token;
    try {
      token = sign(payload, privateKey, {
        expiresIn,
        algorithm: "RS256",
      });
    } catch (error) {
      console.log(error);
    }
    return token ? { token, publicKey } : token;
  },
  verifyJWT: (token, publicKey) => {
    let decoded;
    try {
      const { iat, exp, ...data } = verify(token, publicKey);
      decoded = {
        ...data,
        createdAt: formatDate(new Date(iat * 1000)),
        expiredAt: formatDate(new Date(exp * 1000)),
      };
    } catch (error) {
      console.log(error);
      if (error instanceof TokenExpiredError) {
        decoded = { expiredAt: formatDate(new Date(error.expiredAt)) };
      }
    }
    return decoded;
  },
  getPayloadJWT: (token) => {
    const payloadBase64 = that.decodeBase64(token);
    const start = payloadBase64.indexOf("}") + 1;
    const end =
      payloadBase64.indexOf("}", payloadBase64.indexOf("exp", start)) + 1;
    const { iat, exp, ...payload } = JSON.parse(
      payloadBase64.slice(start, end),
    );
    return payload;
  },
});
