import httpClient from 'utils/httpClient.js';

export const getProfile = () => httpClient.get('auth/get-profile');
