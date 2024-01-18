import AnnounceViewList from 'pages/Announce/AnnounceViewList';
import React from 'react';

const Announce = React.lazy(() => import('pages/Announce/Announce'));
const AnnounceAdd = React.lazy(() => import('pages/Announce/AnnounceAdd'));
const AnnounceEdit = React.lazy(() => import('pages/Announce/AnnounceEdit'));
const AnnounceDetail = React.lazy(() => import('pages/Announce/AnnounceDetail'));

const announceRoute = [
  {
    path: '/announce',
    exact: true,
    name: 'Danh sách thông báo',
    function: 'SYS_ANNOUNCE_VIEW',
    component: Announce,
  },
  {
    path: '/announce/add',
    exact: true,
    name: 'Thêm mới thông báo',
    function: 'SYS_ANNOUNCE_ADD',
    component: AnnounceAdd,
  },
  {
    path: '/announce/edit/:id',
    exact: true,
    name: 'Chỉnh sửa thông báo',
    function: 'SYS_ANNOUNCE_EDIT',
    component: AnnounceEdit,
  },
  {
    path: '/announce/detail/:id',
    exact: true,
    name: 'Chi tiết thông báo',
    function: 'SYS_ANNOUNCE_VIEW',
    component: AnnounceDetail,
  },
  {
    path: '/notification',
    exact: true,
    name: 'Thông báo',
    function: 'SYS_ANNOUNCE_VIEW_LIST',
    component: AnnounceViewList,
  },
  {
    path: '/notification/detail/:id',
    exact: true,
    name: 'Thông báo',
    function: 'SYS_ANNOUNCE_VIEW_LIST',
    component: AnnounceViewList,
  },
];

export default announceRoute;
