import loading from 'assets/bw_image/loading.gif';
import styled from 'styled-components';

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


const renderLoading = ({style , stylechild}) =>{
    return (
      <BackgroundLoading style={style}>
        <LoadingImage src={loading} style={stylechild}/>
      </BackgroundLoading>
    );
}

export default renderLoading