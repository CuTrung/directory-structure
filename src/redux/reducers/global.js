import types from 'reduxApp/actions/types';
import { capitalizedString } from 'utils/helpers';

const INITIAL_STATE = {
  collapsedSideBar: false,
  confirmMessage: undefined,
  confirmCallback: undefined,
  labelAccept: undefined,
  labelRefuse: undefined,
  typeNotify: undefined,
  openNotify: false,
};

const TYPE_NOTIFY = {
  MAIL: 'MAIL',
  ANNOUNCE: 'ANNOUNCE',
};

const typeNotifyOptions = [
  {
    value: TYPE_NOTIFY.MAIL,
    label: 'Danh sách mail',
    icon: 'fi-rr-envelope-open-text',
    //#url api
    apiUrl: 'global/notify',
    redirectUrl: (id, children_id) => {
      if (children_id) {
        return 'mail/detail/' + id + '?children_id=' + children_id;
      }
      return 'mail/detail/' + id;
    },
  },
  {
    value: TYPE_NOTIFY.ANNOUNCE,
    label: 'Danh sách thông báo',
    apiUrl: 'global/notify',
    icon: 'fi-rr-bell',
    redirectUrl: (id) => {
      return 'notification/detail/' + id;
    },
  },
];

export default function globalReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.TRIGGER_SIDEBAR:
      return {
        ...state,
        collapsedSideBar: !state.collapsedSideBar,
      };
    case types.SHOW_CONFIRM_MODAL:
      return {
        ...state,
        confirmMessage: action.payload.message,
        confirmCallback: action.payload.confirmCallback,
        labelAccept: action.payload?.labelAccept,
        labelRefuse: action.payload?.labelRefuse,
      };
    case types.HIDE_CONFIRM_MODAL:
      return {
        ...state,
        confirmMessage: undefined,
        confirmCallback: undefined,
        labelAccept: undefined,
        labelRefuse: undefined,
      };
    case types.SHOW_NOTIFY:
      return {
        ...state,
        openNotify: true,
        typeNotify: typeNotifyOptions.find((e) => e?.value === action.payload),
      };
    case types.HIDE_NOTIFY: {
      return {
        ...state,
        openNotify: false,
        typeNotify: undefined,
      };
    }
    default: {
      if (action.type.includes('GET_GLOBAL_OPTIONS')) {
        let fieldType = action.field;
        const fieldLoadingRequest = `get${capitalizedString(fieldType)}Loading`;
        const fieldDataRequest = `${fieldType}Data`;
        const fieldParamsRequest = `${fieldType}Params`;
        if (action.type.includes('REQUEST')) {
          state[fieldLoadingRequest] = true;
          state[fieldDataRequest] = undefined;
          state[fieldParamsRequest] = undefined;
        } else if (action.type.includes('SUCCESS')) {
          state[fieldLoadingRequest] = false;
          state[fieldDataRequest] = action.payload;
          state[fieldParamsRequest] = action.params;
        }
      }
      return state;
    }
  }
}
