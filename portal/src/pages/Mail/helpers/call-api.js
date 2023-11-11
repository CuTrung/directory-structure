import httpClient from 'utils/httpClient';

export const getListMailNotRead = (params) => {
  return httpClient.get('/mail-box/not-read', { params });
};

export const getListMailInbox = (params) => {
  return httpClient.get('/mail-box', { params });
};

export const getListMailSend = (params) => {
  return httpClient.get('/mail-box/send', { params });
};

export const getListMailFlagged = (params) => {
  return httpClient.get('/mail-box/flagged', { params });
};

export const getListMailDraft = (params) => {
  return httpClient.get('/mail-box/draft', { params });
};

export const getListMailTrash = (params) => {
  return httpClient.get('/mail-box/trash', { params });
};

export const createMail = (params) => {
  return httpClient.post('/mail-box/send-new-email', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDetailMailBox = (id) => {
  return httpClient.get(`/mail-box/${id}`);
};

export const deleteMail = (params) => {
  return httpClient.delete(`/mail-box/${params}`);
};

export const deleteForceMail = (params) => {
  return httpClient.delete(`/mail-box/force-delete/${params}`);
};

// export const deleteMail = (params) => {
//     let ids
//     if (Array.isArray(params)) {
//         ids = ((params || []).map((x) => x.mail_id)).join(',');
//     } else {
//         ids = `${params}`
//     }
//     return httpClient.post(`/mail-box/delete`, { ids });
// };

export const createOrUpdateMailBox = (params) => {
  return httpClient.post(`/mail-box/create-update-mail-box`, params);
};

export const getOptionDepartment = (params) => {
  return httpClient.get('/mail-box/option-department', { params });
};

export const getOptionUser = (params) => {
  return httpClient.get('/mail-box/option-user', { params });
};

export const sendMailReply = (params) => {
  return httpClient.post('/mail-box/sendmailreply', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const upload = (_data = {}) => {
  return httpClient.post('/mail-box/upload-file', _data);
};

///upload-file
