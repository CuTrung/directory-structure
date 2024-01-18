import React from 'react';
import styled from 'styled-components';

const ButtonStyled = styled.button`
  border-radius: 7px;
  outline: none;
  cursor: pointer;
  border: none;
  font-size: 15px;
  padding: 7px 15px;
  display: inline-block;
  transition: all 300ms;

  border: 1px solid ${(props) => props.color};
  color: #fff;

  &:hover {
    border: 1px solid ${(props) => props.color};
    background: ${(props) => props.color};
    color: #fff;
  }

  ${(props) => (props.isActive ? `background: ${props.color};` : `background: #fff; color: ${props.color};`)}
`;

function ToggleButton({ color = '#333333', isActive, onClick, children, ...restProps }) {
  return (
    <ButtonStyled
      color={color}
      isActive={isActive}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      {...restProps}>
      {children}
    </ButtonStyled>
  );
}

export default ToggleButton;
