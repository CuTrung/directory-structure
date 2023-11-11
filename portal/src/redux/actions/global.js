import types from 'redux/actions/types';
import { getOptionsGlobal as _getOptionsGlobal } from 'services/global.service';

const showConfirmModal = (message, confirmCallback, labelAccept, labelRefuse) => ({
  type: types.SHOW_CONFIRM_MODAL,
  payload: { message, labelAccept, labelRefuse, confirmCallback },
});

const hideConfirmModal = () => ({
  type: types.HIDE_CONFIRM_MODAL,
});

const triggerSidebar = () => ({
  type: types.TRIGGER_SIDEBAR,
});

const showNotify = (payload) => ({
  type: types.SHOW_NOTIFY,
  payload: payload,
});

const hideNotify = () => ({
  type: types.HIDE_NOTIFY,
});

const showNotifyHeader = (payload) => async (dispatch) => {
  dispatch(hideNotify);
  dispatch(showNotify(payload));
};

const getOptionsGlobalRequest = (type, field) => ({
  type,
  field,
});

const getOptionsGlobalSuccess = (type, payload, field, params) => ({
  type,
  payload,
  field,
  params,
});

const getOptionsGlobalFailure = (type, payload, field, params) => ({
  type,
  payload,
  field,
  params,
});

const getOptionsGlobal = (field, params) => async (dispatch) => {
  const typeActions = `GET_GLOBAL_OPTIONS_${field.toUpperCase()}`;
  return new Promise((resolve, reject) => {
    dispatch(getOptionsGlobalRequest(`${typeActions}_REQUEST`, field));
    _getOptionsGlobal({
      type: field,
      ...params,
    })
      .then((response) => {
        dispatch(getOptionsGlobalSuccess(`${typeActions}_SUCCESS`, response, field, params));
        resolve(response);
      })
      .catch((error) => {
        dispatch(getOptionsGlobalFailure(`${typeActions}_FAILURE`, error, field, params));
        reject(error);
      });
  });
};

export {
  showConfirmModal,
  hideConfirmModal,
  triggerSidebar,
  showNotify,
  hideNotify,
  showNotifyHeader,
  getOptionsGlobal,
};
