import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { DatePicker } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const FormRangePicker = ({
  fieldStart,
  fieldEnd,
  validation,
  placeholder,
  disabled = false,
  style,
  format,
  bordered = false,
  allowClear,
  ...props
}) => {
  // #region use-form
  const methods = useFormContext();
  const { error: fieldStartError } = methods.getFieldState(fieldStart, methods.formState);
  const { error: fieldEndError } = methods.getFieldState(fieldEnd, methods.formState);

  const error = useMemo(() => {
    return fieldStartError ?? fieldEndError;
  }, [fieldStartError, fieldEndError]);

  // const disabledDate = (current) => {
  //   // Can't select days before today
  //   return current && current < moment().endOf('day');
  // };

  React.useEffect(() => {
    methods.register(fieldStart, validation);
    methods.register(fieldEnd, validation);
  }, [methods, fieldStart, fieldEnd, validation]);
  // #endregion

  return (
    <React.Fragment>
      <RangePicker
        //disabledDate={disabledDate}
        bordered={bordered}
        allowClear={allowClear}
        disabled={disabled}
        minDate={new Date()}
        placeholder={placeholder}
        value={
          methods.watch(fieldStart) || methods.watch(fieldEnd)
            ? [dayjs(methods.watch(fieldStart), format), dayjs(methods.watch(fieldEnd), format)]
            : ''
        }
        onChange={(dates, dateStrings) => {
          if (dates) {
            methods.clearErrors(fieldStart);
            methods.clearErrors(fieldEnd);
            methods.setValue(fieldStart, dateStrings[0]);
            methods.setValue(fieldEnd, dateStrings[1]);
          } else {
            methods.setValue(fieldStart, '');
            methods.setValue(fieldEnd, '');
          }
        }}
        format={format}
        style={{
          width: '100%',
          ...style,
        }}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormRangePicker.propTypes = {
  fieldStart: PropTypes.string,
  fieldEnd: PropTypes.string,
  validation: PropTypes.object,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  allowClear: PropTypes.bool,
  bordered: PropTypes.bool,
};

FormRangePicker.defaultProps = {};

export default FormRangePicker;
