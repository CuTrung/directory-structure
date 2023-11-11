import { toast } from 'react-toastify';

const notifySettings = [
  {
    actions: ['LOG', 'CREATE', 'UPDATE', 'DELETE', 'UPLOAD', 'ACCEPT', 'REJECT', 'CANCEL', 'CHANGE_PASSWORD', 'ADD'],
    status: 'SUCCESS',
    type: 'success',
    message: 'Thành công',
  },
  {
    actions: ['LOG', 'CREATE', 'UPDATE', 'DELETE', 'ACCEPT', 'REJECT', 'CANCEL', 'CHANGE_PASSWORD', 'ADD'],
    status: 'FAILURE',
    type: 'error',
    message: 'Thất bại',
  },
];

const notifyMiddleware = () => (next) => (action) => {
  if (action?.type && (typeof action?.message === 'undefined' || action?.message)) {
    const notifySetting = notifySettings.find(
      (s) => s.actions.find((a) => action.type.includes(a)) && action.type.includes(s.status),
    );
    if (notifySetting) {
      toast(action?.payload.message ?? notifySetting.message, { type: notifySetting.type, theme: 'colored' });
    }
  }

  next(action);
};

export default notifyMiddleware;
