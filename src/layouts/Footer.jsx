import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <div className='globalFooter'>
      Copyright © {new Date().getFullYear()}{' '}
      <a href='https://blackwind.vn/' target={'_blank'} rel='noreferrer'>
        Blackwind Software Solution
      </a>
    </div>
  </Footer>
);
export default FooterView;
