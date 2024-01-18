import { matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import routes from '../routers';
import { useCallback } from 'react';

const _ignoredRoutes = ['/', '/change-password'];

function useVerifyAccess() {
  const { user } = useAuth();

  const verifyPermission = useCallback(
    (permission, any = false) => {
      if (any) return true;
      return Boolean(user?.functions?.find((func) => func?.toUpperCase()?.trim() === permission));
    },
    [user],
  );

  const verify = useCallback(
    (route, location) => {
      let verify = null;
      let ignoredRoute = null;
      if (user && !user.isAdministrator) {
        if (!route && location) {
          route = routes.find((_route) => Boolean(matchPath(location.pathname, _route)));
        }

        if (route) {
          ignoredRoute = _ignoredRoutes.find((_pathname) => Boolean(matchPath(_pathname, route)));
        }

        if (route && !ignoredRoute) {
          let _function = verifyPermission(route.function, route.any);
          if (!_function) {
            verify = 'access_denined';
          }
        }
      }
      return verify || (user ? true : false);
    },
    [user],
  );

  return { verify, verifyPermission };
}

export default useVerifyAccess;
