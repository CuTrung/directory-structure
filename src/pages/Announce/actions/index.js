import { COUNTNOTREAD } from './constants';

export const setCountNotRead = (value) => {
  return {
    type: COUNTNOTREAD,
    payload: value.count,
  };
};
