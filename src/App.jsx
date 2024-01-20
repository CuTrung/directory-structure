import { store } from 'reduxApp/store';
import { Provider } from 'react-redux';
import AppRouter from 'routers/AppRouter';
import { ReactToastify } from 'components/shared/ReactToastify/ReactToastify';
import 'configs';
const App = () => (
  <Provider store={store}>
    <AppRouter />
    <ReactToastify />
  </Provider>
);
export default App;
