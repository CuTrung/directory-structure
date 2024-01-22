import { isFunction } from 'lodash';
import { toast as funcToast } from 'react-toastify';
const TYPE_TOAST = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

const execToast = (type = TYPE_TOAST.INFO, message = 'Đây là thông báo', options) =>
  funcToast[type](isFunction(message) ? message() : message, options);

export const toast = {
  success: (message, options) => execToast(TYPE_TOAST.SUCCESS, message, options),
  error: (message, options) => execToast(TYPE_TOAST.ERROR, message, options),
  info: (message, options) => execToast(TYPE_TOAST.INFO, message, options),
  warning: (message, options) => execToast(TYPE_TOAST.WARNING, message, options),
};
