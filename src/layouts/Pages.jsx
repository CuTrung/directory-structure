import React from "react";
import useVerifyAccess from "hooks/useVerifyAccess";
import { useLocation, useNavigate  } from "react-router-dom";
import { useAuth } from "context/AuthProvider";
import styled from "styled-components";

const DefaultLayout = React.lazy(() => import("./DefaultLayout"));

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
  background: linear-gradient(
    109.6deg,
    rgb(36, 45, 57) 11.2%,
    rgb(16, 37, 60) 51.2%,
    rgb(0, 0, 0) 98.6%
  );
`;

function Pages(props) {
  const { initializing } = useAuth();
  const location = useLocation();
  const { verify } = useVerifyAccess(props);
  const navigate = useNavigate();
  const _verify = verify(null, location);

  if (initializing) {
    return (
      <BackgroundLoading>
        <LoadingImage />
      </BackgroundLoading>
    );
  }

  if (typeof _verify !== "boolean") return navigate(`/500/${_verify}`);
  
  // return _verify ? <DefaultLayout {...props} /> : navigate('/login');
  return <DefaultLayout {...props} />;
}

export default Pages;
