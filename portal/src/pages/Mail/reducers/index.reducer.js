import { COUNTNOTREAD, MAILIDROOT, MAILREFESH, TYPEMAIL, EMAILIDOPEN } from '../actions/constants';

const initialState = {
  countNotRead: 0,
  typeMail: 'inbox',
  query: {
    itemsPerPage: 25,
    page: 1,
  },
};

export default function mailboxReducer(state = initialState, { type, payload }) {
  switch (type) {
    case COUNTNOTREAD: {
      return { ...state, countNotRead: payload };
    }
    case MAILIDROOT: {
      return { ...state, mail_id: payload };
    }
    case MAILREFESH: {
      return { ...state, isRefesh: payload };
    }
    case TYPEMAIL: {
      return { ...state, typeMail: payload };
    }
    case EMAILIDOPEN: {
      return { ...state, mail_id_open: payload };
    }

    default:
      return state;
  }
}
