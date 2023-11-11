import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Error = styled.div`
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
`;
const ErrorMessage = ({ message }) => {
  return <Error>{message}</Error>;
};
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
export default ErrorMessage;
