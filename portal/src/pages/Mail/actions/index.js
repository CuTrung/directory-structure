import { COUNTNOTREAD, MAILIDROOT, MAILREFESH, TYPEMAIL, EMAILIDOPEN } from './constants';
import { createOrUpdateMailBox, getListMailNotRead } from '../helpers/call-api';

export const setCountNotRead = (value) => {
  return {
    type: COUNTNOTREAD,
    payload: value.count,
  };
};

export const setMailId = (value) => {
  return {
    type: MAILIDROOT,
    payload: value,
  };
};

export const setRefesh = (value) => {
  return {
    type: MAILREFESH,
    payload: value,
  };
};

export const setTypeMail = (value) => {
  return {
    type: TYPEMAIL,
    payload: value,
  };
};

export const setMailIdOpen = (value) => {
  return {
    type: EMAILIDOPEN,
    payload: value,
  };
};

export const updateMail = (mail_id, payload) => (dispatch) => {
  let object = { mail_id, is_read: 1 };
  Promise.all([
    new Promise((resolve, reject) => {
      // dispatch(setMailIdOpen(mail_id));
      createOrUpdateMailBox(object, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((response) => {
          reject(response.data);
        });
    }),
    // Sau khi cập nhật đã đọc thì sẽ gọi lấy số lượng mail chưa đọc
    new Promise((resolve, reject) => {
      getListMailNotRead(object, payload)
        .then((response) => {
          dispatch(setCountNotRead(response));
          resolve(response.data);
        })
        .catch((response) => {
          reject(response.data);
        });
    }),
  ]);
};
