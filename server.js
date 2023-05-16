require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const { connectDB } = require('./src/configs/database.config');
const { initRoutes } = require('./src/api/v1/routes/index.route');
const runMigrations = require('./src/api/v1/migrations/index.migration');
const configCors = require('./src/configs/cors.config');
const cookieParser = require('cookie-parser');
const configWriteLog = require('./src/configs/writeLog.config');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

configWriteLog(app);

(async () => await connectDB().then(async () => await runMigrations()))();

configCors(app);

initRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})








