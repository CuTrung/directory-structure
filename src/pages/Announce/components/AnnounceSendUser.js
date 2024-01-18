import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getListDeparmentOptions, getListUserOptions } from '../helpers/call-api';
import { notification } from 'antd';

const AnnounceSendUser = ({ disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const [listDeparment, setListDepartment] = useState([]);
  const [listUser, setListUser] = useState([]);
  
  
  const getListDepartment = async () => {
    try {
      let data = await getListDeparmentOptions();
      data = data.map(({ id, name }) => ({ id, name, value: id, label: name }));
      setListDepartment(data);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };
  const getListUser = async (company_id, department_id) => {
    try {
      if (company_id) {
        let data = await getListUserOptions({ company_id: methods.watch('company_id'), is_get_option: 1 });
        data = data.items.map(({ full_name, user_name }) => ({
          id: user_name,
          name: `${user_name} - ${full_name}`,
          value: user_name,
          label: `${user_name} - ${full_name}`,
        }));
        setListUser(data);
      }
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  useEffect(() => {
    getListDepartment();
  }, []);

  useEffect(() => {
    getListUser(methods.watch('company_id'));
  }, [methods.watch('company_id')]);
  return (
    <BWAccordion title='Danh sách nhận thông báo' isRequired={true} className='bw_row bw_mb_2'>
      <FormItem
        className='bw_col_12'
        disabled={disabled}
        validation={{
          required: 'Cần chọn danh sách nhận thông báo',
        }}>
        <div className='bw_flex bw_align_items_center bw_lb_sex'>
          <label className='bw_radio'>
            <input
              onChange={(e) => methods.setValue('is_send_to_all', 1)}
              type='radio'
              checked={methods.watch('is_send_to_all') === 1}
            />
            <span></span>
            Gửi cho tất cả
          </label>
          <label className='bw_radio'>
            <input
              onChange={(e) => methods.setValue('is_send_to_all', 0)}
              type='radio'
              checked={methods.watch('is_send_to_all') === 0}
            />
            <span></span>
            Gửi cho phòng ban/ người dùng
          </label>
        </div>
      </FormItem>
      {methods.watch('is_send_to_all') === 0 ? (
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem label='Phòng ban'>
              <FormSelect
                field='department'
                validation={{
                  validate: {
                    required: (_, formValues) => {
                      if (!(_ && _.length) && !formValues?.user) {
                        return 'Chọn phòng ban là bắt buộc';
                      }
                    },
                  },
                }}
                allowClear={true}
                placeholder='--Chọn--'
                mode='multiple'
                disabled={disabled}
                onChange={(e, opts) => {
                  methods.setValue('department', opts);

                  methods.clearErrors('user');
                  methods.clearErrors('department');
                }}
                list={listDeparment}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Nhân viên'>
              <FormSelect
                field='user'
                validation={{
                  validate: {
                    required: (_, formValues) => {
                      if (!(_ && _.length) && !(formValues?.department && formValues?.department.length)) {
                        return 'Chọn nhân viên là bắt buộc';
                      }
                    },
                  },
                }}
                mode='multiple'
                allowClear={true}
                disabled={disabled}
                onChange={(e, opts) => {
                  methods.setValue('user', opts);
                  methods.clearErrors('user');
                  methods.clearErrors('department');
                }}
                placeholder='--Chọn--'
                list={listUser}
              />
            </FormItem>
          </div>
        </div>
      ) : null}
    </BWAccordion>
  );
};

export default AnnounceSendUser;
