import { useState } from 'react';
import { useOutlet } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Layout, theme } from 'antd';
const { Content } = Layout;

const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const outlet = useOutlet();
  return (
    <>
      <Layout hasSider>
        <Sidebar collapsed={collapsed} />
        <Layout style={{ marginLeft: 200 }}>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                minHeight: '100vh',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {outlet}
            </div>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
};

export default HomePage;
