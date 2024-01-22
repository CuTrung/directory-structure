import { Route } from 'react-router-dom';
import HomePage from 'layouts/HomePage';
import Login from 'pages/Common/Login';
import Errors from 'layouts/ErrorsPage';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { routers } from 'routers';

const homePageRouter = { path: '/', component: HomePage, exact: true };

const otherRouters = [
  { path: '/login', component: Login, exact: true },
  {
    path: '*',
    component: Errors,
  },
];

const Routes = (_routers = routers, routeParent) => {
  const { verifyRoutePermission } = useVerifyAccess();
  // Check xem user được phép truy cập những route nào
  const routesAccess = otherRouters.concat(_routers.filter((route) => verifyRoutePermission(route.permission)));
  return (
    <Route
      key={homePageRouter.path}
      path={homePageRouter.path}
      exact={homePageRouter.exact}
      errorElement={Errors}
      Component={homePageRouter.component}>
      {routesAccess.map((route) => (
        <Route
          key={route.path}
          index={route.index}
          path={`${routeParent?.path ?? ''}${route.path}`}
          exact={route.exact}
          loader={route.loader}
          errorElement={Errors}
          Component={route.component}>
          {route.children && route.children.length && Routes(route.children, route)}
        </Route>
      ))}
    </Route>
  );
};

export default Routes;
