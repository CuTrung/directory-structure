import httpClient from 'utils/httpClient.js';

export const getListNotify = (url, page, type) => {
  return httpClient.get(url, {
    params: {
      page,
      itemsPerPage: 10,
      type,
    },
  });
};

export const getOptionsGlobal = (params) => {
  return httpClient.get('/global/options', { params });
};

export const getFullName = (params) => {
  return httpClient.get('/global/get-full-name', { params });
};
