import { toUpperCase } from 'utils/string.helper';

function useVerifyAccess() {
  // const { user } = useAuth();
  const user = {
    isAdmin: true,
  };

  const verifyRoutePermission = (permission, allowAll = false) => {
    if (allowAll || user.isAdmin) return true;
    const permissionsUser = [];
    return permissionsUser.find((per) => toUpperCase(per) === permission);
  };

  const verifyUserPermission = () => {};

  return { verifyUserPermission, verifyRoutePermission };
}

export default useVerifyAccess;
