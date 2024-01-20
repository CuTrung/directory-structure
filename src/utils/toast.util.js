import { isFunction } from 'lodash';
import { toast as funcToast } from 'react-toastify';
const options = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

const TYPE_TOAST = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

const execToast = (type = TYPE_TOAST.INFO, message = 'Đây là thông báo') =>
  funcToast[type](isFunction(message) ? message() : message, options);

export const toast = {
  success: (message) => execToast(TYPE_TOAST.SUCCESS, message),
  error: (message) => execToast(TYPE_TOAST.ERROR, message),
  info: (message) => execToast(TYPE_TOAST.INFO, message),
  warning: (message) => execToast(TYPE_TOAST.WARNING, message),
};

export const hello = () => {};
