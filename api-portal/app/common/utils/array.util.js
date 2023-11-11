const convertArrayToObject = (arr = [], defaultValue = null) =>
    Array.from(arr).reduce((acc, item) => ({ ...acc, [item]: item ?? defaultValue }), {});

const convertEnvToArray = (envVar) =>
    envVar
        .slice(1, envVar.length - 1)
        .split(',')
        .map((item) => item.trim());

module.exports = { convertArrayToObject, convertEnvToArray };
