import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { InputNumber } from 'antd';
import styled from 'styled-components';

const InputNumberStyled = styled(InputNumber)`
  .ant-input-number-group-addon {
    border: ${(props) => (props.bordered ? '' : 'none')};
  }
`;

const FormNumber = ({ field, validation, bordered = false, disabled, ...props }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  const formatterNumber = (val) => {
    if (!val) return '';
    return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <React.Fragment>
      <InputNumberStyled
        style={{
          width: '100%',
        }}
        bordered={bordered}
        disabled={disabled}
        formatter={formatterNumber}
        value={methods.watch(field)}
        placeholder='0'
        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        onChange={(value) => {
          methods.clearErrors(field);
          methods.setValue(field, value);
        }}
        controls={false}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormNumber.propTypes = {
  bordered: PropTypes.bool,
  field: PropTypes.string,
  validation: PropTypes.object,
  disabled: PropTypes.bool,
};

export default FormNumber;
