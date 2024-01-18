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

const filesReducer = import.meta.glob("../pages/**/*.reducer.js");
    const funcsReducer = Array.from(new Set(
      Object.keys(filesReducer)
      .map((key) => {
        const match = key.match(/\.\/(.+)\/(.+)\.reducer\.js$/);
        if (match) {
          const [, folder, fileName] = match;
          return {
            path: `/${folder}/${fileName}`,
            component: () => import(`../pages/${folder}/${fileName}.route.js`),
          };
        }
        return null;
      })
      .filter(Boolean)
    )) .reduce((acc, item) => ({ ...acc, [item.name.replace('Reducer', '')]: item }), {});

const reducers = {
  global: globalReducer,
  auth: authReducer,
  ...funcsReducer,
};

export default reducers;
