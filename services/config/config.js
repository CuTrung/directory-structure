require('dotenv').config();
const config = {
    appName: 'TIMBAN CONSUMER',
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    hashSecretKey: process.env.HASH_SECRET_KEY,
    domain_cdn: process.env.DOMAIN_CDN,
    upload_apikey: process.env.UPLOAD_APIKEY,
    service_apikey: process.env.SERVICES_APIKEY,
    token: {
        key: 'Authorization',
        type: 'Bearer',
    },
    database: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        dialect: 'mssql',
    },
    // sql: {
    //   database: process.env.DB_NAME,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASS,
    //   server: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT, 10) || 1433,
    //   pool: {
    //     max: 10,
    //     min: 0,
    //     idleTimeoutMillis: 300000,
    //   },
    //   "options": {
    //     "enableArithAbort": true
    //     }
    // }
    sql: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        server: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        pool: {
            max: 10,
            min: 1,
            idleTimeoutMillis: 300000,
        },
        options: {
            enableArithAbort: true,
            requestTimeout: 3000000,
            encrypt: false
        },
    },
    rabbitmq: {
        url: process.env.AMQP_SERVER
    },
    // connectyCube: {
    //   api: 'https://api.connectycube.com',
    //   appId: 5451,
    //   authKey: 'tnrFaFFZQzhZCYn',
    //   authSecret: 'mPcpfERueeBKcW7',
    //   accountKey: '6UgfpiP9vAufUPjiUfxq',
    //   signature: 'application_id=3565&auth_key=Wpc9Cy5yetpHguL&nonce={nonce}&timestamp={timestamp}'
    // },
    connectycube: {
        creds: {
            appId: '5451',
            authKey: 'tnrFaFFZQzhZCYn',
            authSecret: 'mPcpfERueeBKcW7'
        },
        hash: 'sha1',
        api: 'https://api.connectycube.com',
    },
    mail: {
        MAIL_SMTP_SERVER: process.env.MAIL_SERVER,
        MAIL_SMTP_PORT: process.env.MAIL_PORT,
        MAIL_SECURE: process.env.MAIL_SECURE,
        MAIL_SMTP_USER: process.env.MAIL_USER,
        MAIL_SMTP_PASSWORD: process.env.MAIL_PASSWORD,
        MAIL_FROM: process.env.MAIL_FROM
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_URL,
        password: process.env.REDIS_PWD
    },
    firebase: {
        SDK: process.env.FIREBASEADMINSDK,
        URL: process.env.FIREBASEURL
    },
    BULLMQ: {
        QUEUE: process.env.BULLMQ,
        TOPIC: process.env.BULLMQ_TOPIC
    },
    FACEBOOK: {
        CLIENTID: process.env.FACEBOOK_CLIENTID,
        CLIENTSECRET: process.env.FACEBOOK_CLIENTSECRET
    },
    MQTT: {
        HOST: process.env.MQTT_HOST,
        PORT: process.env.MQTT_PORT,
        USERNAME: process.env.MQTT_USERNAME,
        PASSWORD: process.env.MQTT_PASSWORD
    },
    smsBrandname: {
        rootUrl: process.env.SMS_API_ROOT_URL,
        ApiKey: process.env.SMS_API_KEY,
        SecretKey: process.env.SMS_SECRET_KEY,
        Sandbox: process.env.SMS_SANDBOX,
    },
};

module.exports = config;
