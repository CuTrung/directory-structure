const convertArrayToObject = (arr = [], defaultValue = null) =>
  Array.from(arr).reduce((acc, item) => ({ ...acc, [item]: item ?? defaultValue }), {});

export { convertArrayToObject };
