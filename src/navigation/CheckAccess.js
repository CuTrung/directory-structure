import useVerifyAccess from 'hooks/useVerifyAccess';

function CheckAccess(props) {
  const { verify } = useVerifyAccess(props);
  const _render = () => {
    const { permission, any = false, children } = props;
    const permissions = Array.isArray(permission) ? permission : [permission];
    let result = Boolean(permissions.length);
    for (const permission of permissions) {
      const check = verify({ function: permission }) === true;
      if (check && any) {
        result = true;
        break;
      }
      result = result && check;
    }
    return result === true ? (typeof children === 'function' ? children(true === result) : children) : null;
  };
  return _render();
}

export default CheckAccess;
