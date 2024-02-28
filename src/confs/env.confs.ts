import * as Joi from 'joi';
import { Environments } from 'src/consts';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environments))
    .default(Environments.DEVELOPMENT),
  PORT: Joi.number().default(3000),
});

const _getEnvValue = (env_name: string, isNumber = false) => {
  if (!(env_name && env_name in process.env))
    throw new Error(`${env_name} is't declared in environment`);
  env_name = process.env[env_name.toUpperCase()];
  return isNumber ? parseFloat(env_name) : env_name;
};

export const getEnvs = () => {
  const port = _getEnvValue('PORT', true);
  const base_url = _getEnvValue('BASE_URL');
  const server_prefix = _getEnvValue('SERVER_PREFIX');
  return {
    env: {
      port,
      base_url,
      server_prefix,
      url: `${base_url}:${port}${server_prefix}`,
      white_list: _getEnvValue('WHITE_LIST').toString().split(', '),
      version_latest: _getEnvValue('API_VERSION'),
      node_env: _getEnvValue('NODE_ENV'),
    },
  };
};
