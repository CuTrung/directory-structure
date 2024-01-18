import httpClient from 'utils/httpClient.js';

export const getListMenus = (params = {}) => {
  console.log(params);
  return httpClient.get('/menu', { params });
};
export const getOptionsBusiness = (params) => {
  return httpClient.get('/menu/get-options', { params });
};

export const getDetailMenu = (id) => {
  return httpClient.get(`/menu/${id}`);
};
export const createMenus = (params) => {
  return httpClient.post(`/menu`, params);
};
export const updateMenu = (id, params) => {
  return httpClient.put(`/menu/${id}`, params);
};

export const deleteMenu = (id, params) => {
  return httpClient.delete(`/menu/${id}`, params);
};

export const deleteListMenu = (list_id = []) => {
  return httpClient.delete('/menu', { data: { list_id } });
};

export const getListFunction = (params = {}) => {
  return httpClient.get('/function/get-options');
};
