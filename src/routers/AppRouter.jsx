import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
const Login = React.lazy(() => import('pages/LoginPage'));
const Logout = React.lazy(() => import('pages/LoginPage/LogoutPage'));
const Page500 = React.lazy(() => import('pages/PageError/Page500'));
import routers from 'routers';

const otherRouters = [
  { path: '/login', component: Login, exact: true },
  { path: '/500', component: Page500, exact: true },
  { path: '/logout', component: Logout, exact: true },
];
const Routes = (_routers = otherRouters.concat(routers), routeParent) =>
  _routers.map((route) => (
    <Route
      key={route.path}
      index={route.index}
      path={`${routeParent?.path ?? ''}${route.path}`}
      exact={route.exact}
      Component={route.component}>
      {route.children && route.children.length && Routes(route.children, route)}
    </Route>
  ));

const router = createBrowserRouter(createRoutesFromElements(Routes()));

function AppRouter() {
  return (
    <React.Suspense fallback={null}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default AppRouter;
