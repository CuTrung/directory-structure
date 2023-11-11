import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RedirectHelper from 'pages/RedirectHelper/RedirectHelper';
import VerifyAccess from 'navigation/VerifyAccess';
const Login = React.lazy(() => import('pages/LoginPage'));
const Logout = React.lazy(() => import('pages/LoginPage/LogoutPage'));
const Page500 = React.lazy(() => import('pages/PageError/Page500'));

function AppRouter() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
      <React.Suspense fallback={null}>
        <RedirectHelper
          ref={(ref) => {
            ref && (window._$g.rdr = ref && ref.go);
          }}
        />
        <Switch>
          <Route exact path='/500/:error?' component={Page500} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/logout' component={Logout} />
          <Route path='/' render={() => <VerifyAccess />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
