import React, { Suspense, useMemo } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from 'routers';
import SideBar from './sidebar/SideBar';
import NavHeader from './NavHeader';

function DefaultLayout() {
  const { collapsedSideBar: collapsed } = useSelector((state) => state.global);

  const jsx_render = useMemo(() => {
    return (
      <Suspense fallback={null}>
        <Switch>
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
          <Redirect from='/' to='/404' />
        </Switch>
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
