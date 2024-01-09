export const envStringToArray = (env_variable: string) => {
  if (
    typeof env_variable !== 'string' ||
    !env_variable.includes('[') ||
    !env_variable.includes(']')
  )
    throw new Error('Environment is not a string array');
  return env_variable
    .slice(1, env_variable.length - 1)
    .split(',')
    .map((item) => item.replaceAll("'", '').replaceAll('"', '').trim());
};
