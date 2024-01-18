export const truncate = (str = '', maxLength = 50) => {
  if (!str || typeof str !== 'string' || str.length <= maxLength) return str;
  return `${str.slice(0, str.slice(0, maxLength).lastIndexOf(' '))} ...`;
};
