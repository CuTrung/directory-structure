import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';

const AnnounceViewFilter = ({ onChange }) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form
        className='bw_box_search_notice'
        onSubmit={(e) => {
          e.preventDefault();
          methods.handleSubmit(onChange)(e);
        }}>
        <FormInput field='search' placeholder='Tiêu đề, nội dung thông báo' className='bw_inp' />
        <button type='submit' className='bw_btn bw_btn_success'>Tìm kiếm</button>
      </form>
    </FormProvider>
  );
};

export default AnnounceViewFilter;
