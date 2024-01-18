import styled from 'styled-components';
import { useAuth } from 'context/AuthProvider';
import { useMemo } from 'react';
import { LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'reduxApp/actions/global';
import { COOKIE_JWT } from 'utils/constants';
import { setCookie } from 'utils/cookie';
import { useNavigate } from 'react-router-dom';

const UserSectionStyle = styled.div`
  position: relative;
  z-index: 1;
  &:hover {
    transition: 0.3s;
    .user__section__dropdown {
      display: block;
    }
  }
  .user__section__dropdown {
    display: none;
    position: absolute;
    width: 80%;
    background-color: white;
    border-radius: 10px;
    top: 59px;
    z-index: 3;
    transition: 0.3s;
  }
  .header-menu {
    color: black;
    padding: 8px 8px;
    font-size: 17px;
    z-index: 3;
    cursor: pointer;
    transition: 0.3s;
  }
  .header-menu:hover {
    background: var(--mainColor);
    color: white;
    z-index: 3;
    transition: 0.3s;
  }
  .anticon {
    margin-right: 5px;
  }
`;

export const UserSection = ({ setIsChangePassword }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuUser = useMemo(
    () => [
      {
        key: 'CHANGE_PASSWORD',
        label: (
          <span
            onClick={() => setIsChangePassword(true)}
            className='header-menu'
            style={{ display: 'inline-block', width: '100%' }}>
            <KeyOutlined />
            Đổi mật khẩu
          </span>
        ),
      },
      {
        key: 'LOG_OUT',
        label: (
          <span
            style={{ display: 'inline-block', width: '100%' }}
            className='header-menu'
            onClick={(e) => {
              dispatch(
                showConfirmModal(
                  ['Bạn xác nhận sẽ đăng xuất?'],
                  async () => {
                    e.preventDefault();
                    setCookie(COOKIE_JWT, undefined);
                    navigate('/logout');
                  },
                  'Đồng ý',
                ),
              );
            }}>
            <LogoutOutlined type='logout' />
            Đăng xuất
          </span>
        ),
      },
    ],
    [],
  );

  const { user } = useAuth();
  return (
      <UserSectionStyle key={''} >
        <div className='bw_user_admin bw_flex bw_align_items_center'>
          <img
            alt=''
            style={{
              width: '40px',
              height: '40px',
              border: '0.01px solid #19376d',
              borderRadius: '50%',
            }}
            onError={(e) => {
            }}
          />
          <span className='bw_hidden_nav'>{user?.full_name}</span>
          <div className='user__section__dropdown'>{menuUser.map((o) => o.label)}</div>
        </div>
      </UserSectionStyle>
  );
};
