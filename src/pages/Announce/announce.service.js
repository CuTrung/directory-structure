import { getApi } from 'utils/index';

const prefix = `/user`;
export const getProfile = () => getApi(`${prefix}`);
