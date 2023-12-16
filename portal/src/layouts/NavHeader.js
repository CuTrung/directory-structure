import React, { useEffect, useMemo, useRef, useState } from 'react';
import routes from 'routers';
import { formatter } from 'utils';
import { useDispatch } from 'react-redux';
import { showNotifyHeader } from 'redux/actions/global';
import { TYPE_NOTIFY } from 'utils/constants';
import { useLocation, useHistory } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import NotifyCommon from './notify/NotifyCommon';

const NavHeader = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [routerMap, setRouterMap] = useState([]);

  const notifyActions = useMemo(
    () => [
      {
        onClick: () => {
          dispatch(showNotifyHeader(TYPE_NOTIFY.MAIL));
        },
        icon: 'fi-rr-envelope-open-text',
      },
      {
        onClick: () => {
          dispatch(showNotifyHeader(TYPE_NOTIFY.ANNOUNCE));
        },
        icon: 'fi-rr-bell',
      },
    ],
    [dispatch],
  );

  const getBreadcrumbNameMap = () => {
    const routerMap = {};
    const mergeMenuAndRouter = (data) => {
      data.forEach((menuItem) => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(formatter(routes));
    setRouterMap(routerMap);
  };
  useEffect(getBreadcrumbNameMap, []);

  /**
   * Get Page Title
   * @param {*} pathname
   * @returns
   */
  const getPageTitle = useMemo(() => {
    let currRouterData = null;
    Object.keys(routerMap).forEach((key) => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerMap[key];
      }
    });
    if (!currRouterData) {
      return '';
    }
    return currRouterData.name;
  }, [pathname, routerMap]);

  return (
    <header className='bw_flex bw_align_items_center bw_justify_content_between'>
      <h1>
        <a>
          <i
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              history.goBack();
            }}
            className='fi fi-rr-angle-circle-left'></i>
        </a>
        <span id='bw_form_title'>{getPageTitle}</span>
      </h1>
      <div className='bw_right_header'>
        {notifyActions?.map((e) => (
          <button onClick={e?.onClick} className='bw_btn_header'>
            <span className={`fi ${e?.icon}`}></span>
          </button>
        ))}
        <NotifyCommon />
      </div>
    </header>
  );
};

export default React.memo(NavHeader);