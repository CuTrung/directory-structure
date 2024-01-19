import { Button, Result } from 'antd';
import React, { useRef } from 'react';
import { useLocation, useRouteError } from 'react-router-dom';
import routers from 'routers';

const statusInstance = [
  { status: 404, title: 'Not Found' },
  { status: 500, title: 'Something went wrong! Please try again' },
  { status: 403, title: 'You are not allowed to access this page !' },
];

const Errors = () => {
  const error = useRouteError();
  const statusRef = useRef(404);
  const { pathname } = useLocation();

  if (error) statusRef.current = 500;

  if (routers.find((item) => pathname.includes(item.path))) statusRef.current = 403;

  const { status, title } = statusInstance.find((item) => item.status === statusRef.current);
  return <Result status={status} title={status} subTitle={title} extra={<Button type='primary'>Back Home</Button>} />;
};

export default Errors;
