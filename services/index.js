const expressApp = require('express')();
const init = require('./app/app');
const app = init(expressApp);

exports.app = app;
