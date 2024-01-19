import React from 'react';

const Announce = React.lazy(() => import('pages/Announce/page/Announce'));
const AnnounceChildren = React.lazy(() => import('pages/Announce/page/AnnounceChildren'));

const announceRoute = [
  {
    path: '/announce',
    exact: true,
    name: 'Danh sách thông báo',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Announce,
  },
  {
    path: '/announce/child',
    name: 'Child',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: AnnounceChildren,
  },
];

export default announceRoute;
