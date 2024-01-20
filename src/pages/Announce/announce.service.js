import { getApi } from 'utils';

export const getProfile = () => getApi('auth/get-profile');
