import React from 'react';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { Redirect, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthProvider';
// import BWLoader from 'components/shared/BWLoader';
import loading from 'assets/bw_image/loading.gif';
import styled from 'styled-components';

const DefaultLayout = React.lazy(() => import('../layouts/DefaultLayout'));

const LoadingImage = styled.img`
  display: block;
  width: 3%;
  height: 3%;
  margin: 0 auto;
`;

const BackgroundLoading = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%);
`;

function VerifyAccess(props) {
  const location = useLocation();
  const { initializing } = useAuth();
  const { verify } = useVerifyAccess(props);

  const _render = () => {
    const _verify = verify(null, location);

    if (typeof _verify !== 'boolean') return <Redirect to={`/500/${_verify}`} />;

    return _verify ? <DefaultLayout {...props} /> : <Redirect to='/login' />;
  };

  if (initializing) {
    return (
      <BackgroundLoading>
        <LoadingImage src={loading} />
      </BackgroundLoading>
    );
  }
  return <React.Fragment>{_render()}</React.Fragment>;
}

export default VerifyAccess;
