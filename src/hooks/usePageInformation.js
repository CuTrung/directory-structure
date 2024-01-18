import { useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function usePageInformation() {
  const { pathname } = useLocation();
  const isExistPath = useCallback((path) => pathname.toLowerCase().includes(path), [pathname]);
  const isView = useMemo(() => isExistPath('/detail') || isExistPath('/view'), [isExistPath]);
  const isAdd = useMemo(() => isExistPath('/add'), [isExistPath]);
  const isEdit = useMemo(() => isExistPath('/edit'), [isExistPath]);
  const params = useParams();

  return {
    isAdd,
    isView,
    isEdit,
    params,
  };
}

export default usePageInformation;
