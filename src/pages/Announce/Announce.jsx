import React from 'react';
import { Outlet } from 'react-router-dom';

const Announce = () => {
  return (
    <>
      <div class='bw_main_wrapp'>
        <h1>Hello parent</h1>
        <Outlet />
      </div>
    </>
  );
};

export default Announce;
