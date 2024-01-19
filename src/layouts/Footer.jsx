import { Layout } from 'antd';

const { Footer: FooterLayout } = Layout;
const Footer = () => (
  <FooterLayout style={{ textAlign: 'center', position: 'sticky', bottom: 0 }}>
    Ant Design ©{new Date().getFullYear()} Created by Ant UED
  </FooterLayout>
);
export default Footer;
