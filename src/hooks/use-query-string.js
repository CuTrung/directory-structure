import { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'query-string';

const useQueryString = () => {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const onChange = (newValue, isReplaceHistory = false) => {
    history[isReplaceHistory ? 'replace' : 'push']({
      pathname,
      search: qs.stringify(newValue),
    });
  };

  const value = useMemo(() => qs.parse(search), [search]);

  return [value, onChange];
};

export default useQueryString;
