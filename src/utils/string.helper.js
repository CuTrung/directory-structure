const trimString = (value = '', type = 'all') => {
  if (typeof value !== 'string') throw Error('Not a string');
  const typeTrim = {
    all: 'trim',
    start: 'trimStart',
    end: 'trimEnd',
  };
  if (!(type in typeTrim)) type = 'all';

  return value[typeTrim[type]]();
};

const toLowerCase = (text = '') => trimString(text).toLowerCase();
const toUpperCase = (text = '') => trimString(text).toUpperCase();

const removeDiacritics = (str = '', isTrim = false, typeTrim) =>
  (isTrim ? trimString(str, typeTrim) : str).normalize('NFD')?.replace(/\p{Diacritic}/gu, '');

const capitalizeFirstLetter = (str, isTrim = false, typeTrim) => {
  isTrim ? trimString(str, typeTrim) : str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { toLowerCase, toUpperCase, removeDiacritics, capitalizeFirstLetter, trimString };
