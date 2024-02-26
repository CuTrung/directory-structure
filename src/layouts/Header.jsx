import Breadcrumb from './Breadcrumb';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Layout } from 'antd';
const { Header: HeaderLayout } = Layout;
const Header = ({ collapsed, setCollapsed } = {}) => {
  return (
    <HeaderLayout
      style={{
        padding: 0,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <Breadcrumb />
    </HeaderLayout>
  );
};

export default Header;
