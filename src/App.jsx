import { store } from 'reduxApp/store';
import { Provider } from 'react-redux';
import AppRouter from 'routers/AppRouter';
import { ReactToastify } from 'components/shared/ReactToastify/ReactToastify';

const App = () => (
  <Provider store={store}>
    <AppRouter />
    <ReactToastify />
  </Provider>
);
export default App;
