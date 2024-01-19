import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import routers from 'routers';
import { HomeOutlined } from '@ant-design/icons';

const Breadcrumb = ({ separator = '>' } = {}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const breadcrumbs = useMemo(
    () =>
      routers
        ?.filter(
          (route) => pathname.includes(route.path) && (route.is_breadcrumb === undefined ? true : route.is_breadcrumb),
        )
        ?.map((item) => ({
          title: item.name,
          href: '',
          onClick: (e) => {
            e.preventDefault();
            navigate(item.path);
          },
        })),
    [pathname],
  );
  return (
    <BreadcrumbAntd
      separator={separator}
      items={[
        {
          title: <HomeOutlined />,
          href: '',
          onClick: (e) => {
            e.preventDefault();
            navigate('/');
          },
        },
        ...breadcrumbs,
      ]}
    />
  );
};

export default Breadcrumb;
