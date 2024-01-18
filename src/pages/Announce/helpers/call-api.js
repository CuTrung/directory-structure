import api from 'utils/httpClient';

export const getListAnnounce = (params) => {
  return api.get('/announce', { params });
};

// export const getListGroupSkillOption = () => {
//     return api.get('/skill-group/options',);
// };
export const getListAnnounceView = (params) => {
  return api.get('/announce/list-announce-view', { params });
};
export const getListAnnounceViewLazyLoad = (params = {}) => {
  return api.get('/announce/list-announce-view', { params });
};
export const getListAllAnnounce = (params) => {
  return api.get('/announce/get-all', { params });
};
export const getListAnnounceTypeOptions = (params) => {
  return api.get('/announce/announce-type/get-options', { params }, {});
};

export const getListCompanyOptions = (params) => {
  return api.get('/announce/companies', { params });
};

export const getListDeparmentOptions = (params) => {
  return api.get('/department/get-options', { params });
};

export const getListUserOptions = (params) => {
  return api.get('/user', { params });
};
export const getListUserView = (params) => {
  return api.get('/announce/announce-comment/list-user', { params });
};

export const createAnnounce = (params) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  return api.post('/announce', params, { headers });
};

export const getListReviewByAnnounceTypeId = (params) => {
  return api.get('/announce/get-review-level', { params });
};

export const updateAnnounce = (id, params) => {
  const headers = { 'Content-Type': 'multipart/form-data' };

  return api.put(`/announce/${id}`, params, { headers });
};
export const deleteAnnounce = (list_id = []) => {
  return api.delete(`/announce`, { data: { list_id } });
};
export const getDetail = (id) => {
  return api.get(`/announce/${id}`);
};
export const approvedReview = (params) => {
  return api.post('/announce/review', params);
};

export const downloadAttachment = (id) => {
  const header = {
    responseType: 'blob',
  };
  return api.get(`announce/attachment/download/${id}`, header);
};

export const getListAnnounceNotRead = (params) => {
  return api.get('/announce/not-read', { params });
};

export const createAnnounceUserView = (params) => {
  return api.post('/announce/create-announce-user-view', params);
};
export const getAnnounceView = (id) => {
  return api.get(`/announce/announce-view/${id}`);
};
