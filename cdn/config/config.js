require('dotenv').config()

const config = {
    apiKey: process.env.API_KEY,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
}

module.exports = config;