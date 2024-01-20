import { getApi } from 'utils';

const prefix = `/user`;
export const getProfile = () => getApi(`${prefix}`);
