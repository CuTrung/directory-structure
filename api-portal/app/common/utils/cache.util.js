const cache = require('../classes/cache.class');

module.exports = {
    removeByKey: async (key) => new Promise((resolve) => cache.del(key, (err) => resolve(err ? false : true))),
};
