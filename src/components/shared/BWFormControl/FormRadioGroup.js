import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

const FormRadioGroup = ({ field, validation, className, disabled = false, list, custom = false }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  return (
    <React.Fragment>
      <div
        className={
          !custom || custom === false
            ? 'bw_flex bw_align_items_center bw_lb_sex bw_sex_group'
            : 'bw_flex bw_align_items_center bw_lb_sex'
        }>
        {(list || []).map((item, index) => {
          return (
            <React.Fragment key={index}>
              <label className='bw_radio'>
                <input
                  type='radio'
                  name='bw_type'
                  id={item.key}
                  className={className}
                  disabled={disabled}
                  checked={methods.watch(field) == item.value}
                  onChange={(e) => {
                    methods.clearErrors(field);
                    methods.setValue(field, item.value);
                  }}
                />
                <span />
                {item.label}
              </label>
            </React.Fragment>
          );
        })}
        {error && <ErrorMessage message={error?.message} />}
      </div>
    </React.Fragment>
  );
};
FormRadioGroup.propTypes = {
  field: PropTypes.string,
  validation: PropTypes.object,
  content: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  className: PropTypes.string,
};

export default FormRadioGroup;
