const { hashSync, compareSync, genSaltSync } = require('bcrypt');

const trimString = (value = '', type = 'all') => {
    if (typeof value !== 'string') return value;
    const typeTrim = {
        all: 'trim',
        start: 'trimStart',
        end: 'trimEnd',
    };
    if (!(type in typeTrim)) type = 'all';

    return value[typeTrim[type]]();
};

const toLowerCaseString = (text = '') => trimString(text).toLowerCase();

const hashString = (str = '', isTrim = false, typeTrim) =>
    hashSync(isTrim ? trimString(str, typeTrim) : str, genSaltSync(10));

const compareStringHash = (str, hashStr, isTrim = false) =>
    compareSync(isTrim ? trimString(str, typeTrim) : str, hashStr);

const randomString = () => crypto.randomUUID().toString();

const removeDiacritics = (str = '', isTrim = false, typeTrim) =>
    (isTrim ? trimString(str, typeTrim) : str).normalize('NFD')?.replace(/\p{Diacritic}/gu, '');

const decodeBase64 = (strBase64) => Buffer.from(strBase64, 'base64').toString('utf-8');

const encodeBase64 = (value) => Buffer.from(JSON.stringify(value), 'utf-8').toString('base64');

const capitalizeFirstLetter = (str, isTrim = false, typeTrim) => {
    isTrim ? trimString(str, typeTrim) : str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = {
    toLowerCaseString,
    hashString,
    compareStringHash,
    randomString,
    removeDiacritics,
    decodeBase64,
    encodeBase64,
    capitalizeFirstLetter,
    trimString,
};
