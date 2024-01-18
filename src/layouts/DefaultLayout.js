import React, { Suspense, useMemo } from 'react';
import { Route, BrowserRouter, withRouter, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from 'routers';
import SideBar from './sidebar/SideBar';
import NavHeader from './NavHeader';

function DefaultLayout() {
  const { collapsedSideBar: collapsed } = useSelector((state) => state.global);

  const jsx_render = useMemo(() => {
    return (
      <Suspense fallback={null}>
        <BrowserRouter>
          <Routes>
            {routes.map((route) => {
              return (
                route.component && (
                  <Route
                    key={new Date().getTime()}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                  />
                )
              );
            })}
          </Routes>
        </BrowserRouter>
      </Suspense>
    );
  }, [routes]);

  return (
    <div className={`bw_contain ${collapsed ? 'bw_close_nav' : ''}`}>
      <SideBar />
      <div className='bw_main'>
        <NavHeader />
        {jsx_render}
      </div>
    </div>
  );
}

export default withRouter(DefaultLayout);
