const redis = require('redis');
const config = require('../../../config/config');
const { REDIS } = require('../const/bullmq.const');

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
});

client.on('error', (err) => {
    console.log('Error ' + err);
});

const getAll = (keys = 'member') => {
    return new Promise((resolve, reject) => {
        var all_parts = [];
        client.keys(`${REDIS}${keys}:*`, (err, keys) => {
            var count = keys.length;
            if (!count || count == 0) resolve([]);
            keys.forEach((key) => {
                client.get(key, (err, obj) => {
                    if (err) return reject(err);
                    all_parts.push(JSON.parse(obj));
                    --count;
                    if (count <= 1) {
                        resolve(all_parts);
                    }
                });
            });
        });
    });
};

const get = (key) => {
    return new Promise((resolve, reject) => {
        client.get(`${REDIS}${key}`, (err, data) => {
            if (err) return resolve({});
            resolve(JSON.parse(data));
        })
    })
}

const set = (key, data) => {
    if (!key || !data) return;
    return new Promise((resolve, reject) => {
        client.set(`${REDIS}${key}`, JSON.stringify(data), (err, d) => {
            if (err) return reject(err);
            resolve(true);
        })
    })
}

const del = key => {
    return new Promise(resolve => {
        client.del(`${REDIS}${key}`, (err, reply) => resolve(true))
    })
}

const delAll = () => {
    return new Promise((resolve, reject) => {
        client.flushdb(function (err, succeeded) {
            if (err) return reject(err);
            resolve(true);
        });
    })
}

module.exports = {
    client,
    getAll,
    get,
    set,
    del,
    delAll
};
