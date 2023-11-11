const redis = require('redis');
const config = require('../../../config/index.config');
const { REDIS } = require('../const/bullmq.const');

const url = `redis://:${config.redis.password}@${config.redis.host}:${config.redis.port}`;

const client = redis.createClient({
    url,
});
client.connect();
client.on('ready', () => {
    console.log('Connected redis success!');
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

const get = async (key = 'member') => {
    return await client.get(`${REDIS}:${key}`);
};

// Bỏ điều kiện check data để set data bằng null;
const setV2 = (key, data) => {
    try {
        if (!key) return;
        return new Promise((resolve, reject) => {
            client.set(`${REDIS}:${key}`, JSON.stringify(data), (err, d) => {
                console.log(err, d);
                if (err) return reject(err);
                resolve(true);
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const set = (key, data) => {
    try {
        if (!key || !data) return;
        return new Promise((resolve, reject) => {
            client.set(`${REDIS}:${key}`, JSON.stringify(data), (err, d) => {
                console.log(err, d);
                if (err) return reject(err);
                resolve(true);
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const del = (key) => {
    return new Promise((resolve) => {
        client.del(`${REDIS}${key}`, (p, q) => resolve(true));
    });
};

const delAll = () => {
    return new Promise((resolve, reject) => {
        client.flushDb(function (err, succeeded) {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

const setHash = async (key, field, data, onlyKey = true) => {
    if (!key || !data) return;
    const result = await client.hSet(onlyKey ? key : `${REDIS}${key}`, field, JSON.stringify(data));
    return result;
};

const getByHash = async (key, field) => {
    try {
        if (!key || !field) return;
        return await client.HGET(key, field);
    } catch (error) {
        throw new Error('Fail');
    }
};

const delHash = async (key, field) => {
    return await client.HDEL(key, field);
};

module.exports = {
    client,
    setHash,
    getByHash,
    delHash,
    getAll,
    get,
    set,
    setV2,
    del,
    delAll,
};
