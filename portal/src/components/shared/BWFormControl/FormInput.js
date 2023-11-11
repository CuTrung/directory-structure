import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

const FormInput = ({ field, validation, type = 'text', placeholder, className, disabled, ...props }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  const handleChange = (e) => {
    methods.clearErrors(field);
    methods.setValue(field, type === 'checkbox' || type == 'radio' ? (e.target.checked ? 1 : 0) : e.target.value);
  };

  return (
    <React.Fragment>
      <input
        type={type}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        value={methods.watch(field) ?? ''}
        checked={(type === 'checkbox' || type == 'radio') && Boolean(methods.watch(field))}
        onChange={handleChange}
        style={{ lineHeight: 1 }}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  field: PropTypes.string,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

FormInput.defaultProps = {
  type: 'text',
  className: '',
};

export default FormInput;
