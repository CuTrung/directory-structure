import { COUNTNOTREAD } from '../actions/constants';

const initialState = {
  countNotRead: 0,
};

export const announce = (state = initialState, { type, payload }) => {
  switch (type) {
    case COUNTNOTREAD: {
      return { ...state, countNotRead: payload };
    }
    default:
      return state;
  }
};
