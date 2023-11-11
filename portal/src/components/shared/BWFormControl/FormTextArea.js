import { useFormContext } from 'react-hook-form';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

const FormTextArea = ({ field, validation, placeholder, disabled, className, style, rows }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);

  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  return (
    <React.Fragment>
      <textarea
        style={style}
        rows={rows}
        className={classNames(className ?? 'form-control', { 'is-invalid': error })}
        disabled={disabled}
        placeholder={placeholder}
        value={methods.watch(field) ?? ''}
        onChange={(e) => {
          methods.clearErrors(field);
          methods.setValue(field, e.target.value);
        }}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormTextArea.propTypes = {
  field: PropTypes.string,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default FormTextArea;
