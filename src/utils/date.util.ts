const getCurrentDate = (format = 'en-GB') =>
  new Date().toLocaleString(format, { hour12: false });

export { getCurrentDate };
