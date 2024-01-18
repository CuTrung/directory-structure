import httpClient from 'utils/httpClient.js';

export const getList = (params = {}) => {
  return httpClient.get('/user', { params });
};

export const deleteUser = (params) => {
  const ids = (params || []).map((x) => x.user_id);
  return httpClient.post(`/user/delete`, { ids });
};
export const getOptionsUser = (params) => {
  return httpClient.get('/user/get-options', { params });
};

export const getDetail = (id) => {
  return httpClient.get(`/user/${id}`);
};

export const changePassword = (userId, params) => {
  return httpClient.put(`/user/${userId}/change-password`, params);
};

// đổi password của user check theo token
export const changeYourPassword = (params) => {
  return httpClient.put(`/user/change-password`, params);
};

export const create = (params) => {
  return httpClient.post(`/user`, params);
};
export const update = (id, params) => {
  return httpClient.put(`/user/${id}`, params);
};

export const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append('user', file);

  return httpClient.post('/user/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getListUserOpts = (params = {}) => {
  return httpClient.get('/user', { params });
};

export const getDataSkill = (params) => {
  return httpClient.get(`/user/skill/get-data`, { params });
};

export const getListSalaryHistory = (username, params) => {
  return httpClient.get(`/user/salary-history/${username}`, { params });
};

export const getListPositionHistory = (username, params) => {
  return httpClient.get(`/user/position-history/${username}`, { params });
};

export const genUsername = () => {
  return httpClient.get(`/user/gen-username`);
};

export const syncExtensionVoip = (data) => {
  return httpClient.post(`/voip/sync`, data);
};
