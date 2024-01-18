import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  pointer-events: ${(props) => (props.nonPoiner ? 'none' : 'auto')};
`;

const DisableStyle = styled.span`
  display: ${(props) => props.display ?? 'block'};
`;

const LabelStyle = styled.span`
  opacity: 0.7;
`;

const FormItem = ({
  className,
  label,
  hiddenLabel = false,
  isRequired = false,
  children,
  disabled,
  display,
  style,
}) => {
  return (
    <Wrapper nonPoiner={disabled} className={className}>
      <div
        className={`bw_relative bw_frm_box ${disabled ? 'bw_disable' : ''} ${style === 'gray' ? 'bw_readonly' : ''}`}>
        {!hiddenLabel && (
          <LabelStyle>
            {label} {isRequired && <span className='bw_red'>*</span>}
          </LabelStyle>
        )}
        <DisableStyle display={display} disabled={disabled}>
          {children}
        </DisableStyle>
      </div>
    </Wrapper>
  );
};

FormItem.propTypes = {
  label: PropTypes.string,
  hiddenLabel: PropTypes.bool,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
};

export default FormItem;
