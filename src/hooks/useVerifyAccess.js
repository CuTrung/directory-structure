import { matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import routes from '../routers';
import { useCallback } from 'react';

const _ignoredRoutes = ['/', '/change-password'];

function useVerifyAccess(props) {
  const { user } = useAuth();

  const verifyPermission = useCallback(
    (permission, any = false) => {
      if (any) return true;
      const { functions = [] } = user;
      let _function = functions.find((_func) => {
        let funcUC = (_func + '').toUpperCase().trim();
        return funcUC === permission;
      });
      return !!_function;
    },
    [user],
  );

  const verify = useCallback(
    (route, location) => {
      let verify = null;
      let ignoredRoute = null;
      if (user && !user.isAdministrator) {
        if (!route && location) {
          route = routes.find((_route) => {
            let result = matchPath(location.pathname, _route);
            return !!result;
          });
        }

        if (route) {
          ignoredRoute = _ignoredRoutes.find((_pathname) => {
            let result = matchPath(_pathname, route);
            return !!result;
          });
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
