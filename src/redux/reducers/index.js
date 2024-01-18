import authReducer from "pages/LoginPage/slice/authSlice";
import globalReducer from "reduxApp/reducers/global";

// const filesReducer = require.context('../../pages', true, /\.reducer\.js$/);
// const funcsReducer = Array.from(
//   new Set(
//     filesReducer
//       .keys()
//       .map(filesReducer)
//       .map(({ default: reducers }) => reducers)
//       .flat(),
//   ),
// ).reduce((acc, item) => ({ ...acc, [item.name.replace('Reducer', '')]: item }), {});

const reducers = {
  global: globalReducer,
  auth: authReducer,
  // ...funcsReducer,
};

export default reducers;
