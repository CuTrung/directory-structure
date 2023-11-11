const { capitalizeFirstLetter } = require('./string.util');
const logger = require('../classes/logger.class');

const TYPES = {
    NUMBER: 'Number',
    STRING: 'String',
    BOOLEAN: 'Boolean',
    OBJECT: 'Object',
    ARRAY: 'Array',
    MAP: 'Map',
    SET: 'Set',
    FUNCTION: 'Function',
    NULL: 'Null',
    UNDEFINED: 'Undefined',
};

const isTypeArray = (arr, typeArr = TYPES.UNDEFINED) => {
    typeArr = capitalizeFirstLetter(typeArr);
    if (!Object.values(TYPES).includes(typeArr)) return false;
    return arr.every((item) => typeOf(item) === typeArr);
};

const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1);

const isTypeOf = (value, type = TYPES.UNDEFINED) => typeOf(value) === type;

const callerAt = () => {
    const frame = new Error().stack.split('\n')[3];
    return frame.slice(frame.indexOf('('));
};

const withTryCatch = (cb) => {
    return async (...args) => {
        try {
            return await cb(...args);
        } catch (error) {
            logger.error(error.message, {
                func: cb.name,
                lineError: callerAt(),
            });
        }
    };
};

const checkOverload = (time = 60000) => {
    setInterval(() => {
        const numConnections = 5; // Số connect hiện tại của DB
        const memoryUsage = process.memoryUsage().rss;
        const numCores = require('os').cpus().length;
        const maxConnections = numCores * 5;
        console.log(
            `>>> Active connections: ${numConnections}`,
            `|| Memory usage: ~${Math.floor(memoryUsage / Math.pow(1024, 2))} MB`,
        );
        if (numConnections > maxConnections) {
            console.log(`>>> Connection overload detected !`);
        }
    }, time);
};

module.exports = {
    TYPES,
    isTypeArray,
    isTypeOf,
    withTryCatch,
    checkOverload,
};
