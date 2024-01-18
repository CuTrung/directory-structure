import  { useMemo } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "routers";
import SideBar from "./sidebar/SideBar";
import NavHeader from "./NavHeader";

function DefaultLayout() {
  const { collapsedSideBar: collapsed } = useSelector((state) => state.global);

  const jsx_render = useMemo(() => routes.map((route) => {
    return (
      route.component && (
        <Route
          key={new Date().getTime()}
          path={route.path}
          exact={route.exact}
          name={route.name}
          element={route.component}
        />
      )
    )
  }), [routes]);

  return (
    <div className={`bw_contain ${collapsed ? "bw_close_nav" : ""}`}>
      <SideBar />
      <div className="bw_main">
        <NavHeader />
        {jsx_render}
      </div>
    </div>
  );
}

export default DefaultLayout;
