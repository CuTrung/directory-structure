// node cachemanager
const cacheManager = require('cache-manager');
// storage for the cachemanager
const fsStore = require('cache-manager-fs');

const appRoot = require('app-root-path');
const path = require('path');

const pathCacheFolder = path.normalize(`${appRoot}/storage/caches`);

const diskCache = cacheManager.caching({
    store: fsStore,
    options: {
        ttl: 60 * 60 /* seconds */,
        maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */,
        path: pathCacheFolder,
        preventfill: true,
        // zip: true,
    },
});

module.exports = diskCache;
