import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';

const MailFilter = ({ onChange }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          methods.handleSubmit(onChange)(e);
        }}>
        <div className='bw_search_email'>
          <button>
            <span className='fi fi-rr-search' />
          </button>
          <FormInput field='keyword' placeholder='Tìm kiếm email' />
        </div>
      </form>
    </FormProvider>
  );
};

export default MailFilter;
