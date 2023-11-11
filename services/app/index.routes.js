const express = require('express');
const path = require('path');
const requireContext = require('require-context');
const config = require('../config/config');
const router = express.Router();

router.get('/', (req, res) =>
  res.send(config.appWelcome),
);

if (!config.testing) {
  try {
    const allRoutes = requireContext(path.join(__dirname, './module'), true, /\.route\.js$/);
    allRoutes.keys().forEach((route) => {
      const curRoute = require('./module/' + route);
      if(!curRoute.routes){
        console.log('error route' + route)
      }
      router.use(curRoute.prefix, curRoute.routes);
    });
  } catch (error) {
    console.log('~ initRoute error >>>', error)
  }
}

module.exports = router;
