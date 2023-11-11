import httpClient from 'utils/httpClient';

const path = '/dashboard';

export const getSummary = () => {
  return httpClient.get(`${path}/summary`);
};

export const getReceiveslipChart = (params = {}) => {
  return httpClient.get(`${path}/chart/receiveslip`, { params });
};


export const getListAnnounceDashboard = () => {
  return httpClient.get(`${path}/announce`);
};

export const getListNews = () => {
  return httpClient.get(`${path}/news`);
};

export const getListMail = () => {
  return httpClient.get(`${path}/mail`);
};

export const getListStock = () => {
  return httpClient.get(`${path}/stock`);
};


export const getDebit = () => {
  return httpClient.get(`${path}/debit`);
};

