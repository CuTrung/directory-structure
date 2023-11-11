import React from 'react';

const Mail = React.lazy(() => import('pages/Mail/Mail'));
const MailCompose = React.lazy(() => import('pages/Mail/Tab/MailCompose'));
const MailSend = React.lazy(() => import('pages/Mail/Tab/MailSend'));
const MailFlagged = React.lazy(() => import('pages/Mail/Tab/MailFlagged'));
const MailDraft = React.lazy(() => import('pages/Mail/Tab/MailDraft'));
const MailTrash = React.lazy(() => import('pages/Mail/Tab/MailTrash'));
const MailDetail = React.lazy(() => import('pages/Mail/Tab/Detail/MailDetail'));

const mailRoute = [
  {
    path: '/mail',
    exact: true,
    name: 'Hộp thư đến',
    function: 'SYS_MAIL_VIEW',
    component: Mail,
  },
  {
    path: '/mail/compose',
    exact: true,
    name: 'Soạn email',
    function: 'SYS_MAIL_CREATE',
    component: MailCompose,
  },
  {
    path: '/mail/send',
    exact: true,
    name: 'Hộp thư đi',
    function: 'SYS_MAIL_VIEW',
    component: MailSend,
  },
  {
    path: '/mail/flagged',
    exact: true,
    name: 'Thư đánh dấu',
    function: 'SYS_MAIL_VIEW',
    component: MailFlagged,
  },
  {
    path: '/mail/draft',
    exact: true,
    name: 'Thư nháp',
    function: 'SYS_MAIL_VIEW',
    component: MailDraft,
  },
  {
    path: '/mail/trash',
    exact: true,
    name: 'Thùng rác',
    function: 'SYS_MAIL_VIEW',
    component: MailTrash,
  },
  {
    path: '/mail/detail/:id',
    exact: true,
    name: 'Đọc mail',
    function: 'SYS_MAIL_VIEW',
    component: MailDetail,
  },
];

export default mailRoute;
