import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

function LogoutPage(props) {
  const { user, logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);

  if (!user) return <Redirect to='/' push />;

  return (
    <div className='app flex-row align-items-center'>
      <div>
        <div className='justify-content-center'>
          <div color='primary' />
          <span className='px-2 py-2'>Logging you out, please wait...</span>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
