import React, { useState } from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { useEffect } from 'react';
import { getListCompanyOptions, getListAnnounceTypeOptions } from '../helpers/call-api';
import { notification } from '../../../../node_modules/antd/es/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import { useFormContext } from 'react-hook-form';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';



export function AnnounceInfo({ disabled }) {
  const methods = useFormContext();
  const { setValue } = methods;
  const [dataListCompany, setDataListCompany] = useState([]);
  const [dataListAnnounceType, setDataListAnnounceType] = useState([]);
  const getListCompany = async () => {
    try {
      let data = await getListCompanyOptions();
      data = data.items.map(({ company_id, company_name }) => ({
        value: company_id,
        label: company_name,
      }));
      if (data && data.length === 1) {
        setValue('company_id', data[0].value);
      }
      setDataListCompany(data);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };
  const getListAnnounceType = async () => {
    try {
      let data = await getListAnnounceTypeOptions();
      data = data.map(({ announce_type_id, announce_type_name }) => ({
        value: announce_type_id,
        label: announce_type_name,
      }));
      setDataListAnnounceType(data);
      if (data && data.length === 1) {
        setValue('announce_type_id', data[0].value);
      }
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };
  useEffect(() => {
    getListCompany();
    getListAnnounceType();
  }, []);



  return (
    <BWAccordion title='Thông tin thông báo' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tiêu đề' isRequired>
            <FormInput
              type='text'
              field='announce_title'
              placeholder='Tiêu đề thông báo'
              validation={{
                required: 'Tên thông báo là bắt buộc !',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Loại thông báo' isRequired={true}>
            <FormSelect
              field='announce_type_id'
              list={dataListAnnounceType}
              validation={{
                required: 'Loại thông báo là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Công ty áp dụng' isRequired={true}>
            <FormSelect
              field='company_id'
              list={dataListCompany}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <FormItem
          label='Ngày công bố'
          className='bw_col_4'
          isRequired={true}
          disabled={disabled}
        >
          <FormDatePicker
            field='published_date'
            validation={{ required: 'Ngày công bố là bắt buộc' }}
            placeholder={'dd/mm/yyyy'}
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            bordered={false}
            allowClear
          />
        </FormItem>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='description' rows={3} disabled={disabled} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export const AnnounceContent = ({ disabled }) => {

  return (
    <BWAccordion title='Nội dung' id='bw_des' isRequired>
      <FormEditor
        field='announce_content'
        disabled={disabled}
        validation={{
          required: 'Nội dung là bắt buộc',
        }}

      />
    </BWAccordion>
  );
};

export function DegreeStatus({ disabled }) {
  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}
