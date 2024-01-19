import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Routes from './Routes';

const router = createBrowserRouter(createRoutesFromElements(Routes()));
function AppRouter() {
  return (
    <React.Suspense fallback={null}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default AppRouter;
