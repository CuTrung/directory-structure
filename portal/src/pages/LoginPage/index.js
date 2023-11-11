import React, { useState } from 'react';
import logoLogin from 'assets/bw_image/logo_login.png';
import { useAuth } from 'context/AuthProvider';
import { Button, Form, Alert } from 'antd';
import { Redirect } from 'react-router-dom';
import { getErrorMessage } from 'utils';
import { getFunctions, getProfile, login } from 'services/auth.service';
import { setCookie } from 'utils/cookie';
import { COOKIE_JWT } from 'utils/constants';
import { LoadingOutlined } from '@ant-design/icons';

const initialValues = {
  user_name: '',
  password: '',
  platform: 'portal',
};

function LoginPage() {
  const { user = null, setUser, initializing, setInitializing } = useAuth();
  const [msgErr, setMsgErr] = useState(null);

  const handleSubmitLogin = async (values) => {
    setInitializing(true);
    try {
      let token = await login(values);
      setCookie(COOKIE_JWT, JSON.stringify(token));
      let profileData = await getProfile();
      if (!profileData.isAdministrator) {
        let functions = await getFunctions();
        profileData.functions = functions;
      }
      setUser(profileData);
    } catch (error) {
      setMsgErr(getErrorMessage(error));
    } finally {
      setInitializing(false);
    }
  };

  if (user) {
    return <Redirect to='/' push />;
  }

  return (
    <div className='bw_main_login'>
      <Form
        initialValues={initialValues}
        scrollToFirstError={true}
        name='frmLogin'
        layout='vertical'
        size='large'
        onFinish={handleSubmitLogin}
        className='bw_form_login'>
        <img src={logoLogin} alt={2} />
        <h1 style={{ maxWidth: '100%' }}>Đăng nhập</h1>
        {msgErr && (
          <Alert message={msgErr} className='bw_mb_2' type='error' showIcon closable onClose={() => setMsgErr(null)} />
        )}
        <Form.Item
          name='user_name'
          disabled={initializing}
          rules={[
            {
              required: true,
              message: 'ID Nhân viên là bắt buộc',
            },
          ]}>
          <input type='text' placeholder='ID Nhân viên' className='bw_inp' style={{ margin: 0 }} />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: 'Mật khẩu là bắt buộc',
            },
          ]}>
          <input
            disabled={initializing}
            type='password'
            placeholder='Mật khẩu'
            className='bw_inp'
            style={{
              margin: 0,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={initializing}
            icon={initializing ? <LoadingOutlined /> : undefined}
            type='primary'
            htmlType='submit'
            className='bw_btn bw_btn_login'>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
