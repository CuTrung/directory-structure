import React from 'react';
import AppRouter from 'routers/AppRouter';
import { store } from 'redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from 'context/AuthProvider';
import 'assets/bw_scss/blackwind.scss';
import 'assets/bw_scss/main.css';
import 'styles/App.css';
import ConfirmModal from 'components/shared/ConfirmDeleteModal';
import { ReactToastify } from 'components/shared/ReactToastify/ReactToastify';

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <AppRouter />
      <ReactToastify />
      <ConfirmModal />
      <div id='bw_modal_root'></div>
    </AuthProvider>
  </Provider>
);
export default App;
