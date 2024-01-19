import React from 'react';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const items = [UserOutlined, VideoCameraOutlined].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const Sidebar = ({ collapsed }) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}>
      <div className='demo-logo-vertical' />
      <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']} items={items} />
    </Sider>
  );
};

export default Sidebar;
