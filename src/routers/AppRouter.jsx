import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Pages from "layouts/Pages";
const Login = React.lazy(() => import("pages/LoginPage"));
const Logout = React.lazy(() => import("pages/LoginPage/LogoutPage"));
const Page500 = React.lazy(() => import("pages/PageError/Page500"));
function AppRouter() {
  return (
    <BrowserRouter basename={globalThis.REACT_APP_BASENAME}>
      <React.Suspense fallback={null}>
        <Routes>
          <Route exact path="/500" element={<Page500 />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/logout" element={<Logout />} />
          <Route path="/"  element={<Pages />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
