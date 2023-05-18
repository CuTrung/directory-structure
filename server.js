require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

const { initRoutes } = require('./src/api/v1/routes/index.route');
const cookieParser = require('cookie-parser');
const { configWriteLog, configCors } = require('./src/configs/index.config');
const { connectMySQL, connectMongoDB, connectRedis } = require('./src/configs/db.config');

connectMySQL({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})


// connectMongoDB({
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
// })


// connectRedis({
//     host: process.env.DB_HOST,
// })


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

configWriteLog(app);
configCors(app);

initRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})







