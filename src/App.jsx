import React from "react";
import AppRouter from "routers/AppRouter";
import { store } from "reduxApp/store";
import { Provider } from "react-redux";
import { AuthProvider } from "context/AuthProvider";
import { ReactToastify } from "components/shared/ReactToastify/ReactToastify";
import "./configs/env.config";
const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <AppRouter />
      <ReactToastify />
    </AuthProvider>
  </Provider>
);
export default App;
