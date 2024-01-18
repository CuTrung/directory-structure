import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip } from 'antd';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getListFunction, getListMenus } from 'pages/Menus/menus.service';
import styled from 'styled-components';

const HelperText = styled.div`
  font-size: 10px;
  color: #999;
`;

const MenusInformation = ({ disabled, dataListMenu }) => {
  const [dataListFunction, setDataListFunction] = useState([]);

  const loadFunction = useCallback(() => {
    getListFunction().then(setDataListFunction);
  }, []);
  useEffect(loadFunction, [loadFunction]);
  return (
    <BWAccordion title='Thông tin menu'>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem isRequired label='Tên menu'>
              <FormInput
                disabled={disabled}
                type='text'
                field='menu_name'
                placeholder='Nhập tên menu'
                validation={{
                  required: 'Tên menu cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <div className='bw_frm_box'>
              <div className='bw_flex bw_justify_content_between'>
                <label>Icon</label>
                <Tooltip
                  placement='topRight'
                  color='white'
                  title={
                    <a href='https://coreui.io/react/#/icons/font-awesome' target='_blank' rel='noreferrer'>
                      https://coreui.io/react/#/icons/font-awesome
                    </a>
                  }>
                  <label>Xem danh sách hỗ trợ</label>
                </Tooltip>
              </div>
              <FormInput disabled={disabled} type='text' field='icon_path' placeholder='Nhập tên icon' />
              <HelperText>
                Lưu ý: nếu dùng class icons "Font Awesome" thì thêm prefix "fa fa-" (vd: "fa fa-address-book")
              </HelperText>
            </div>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Link'>
              <FormInput
                disabled={disabled}
                type='text'
                field='link_menu'
                placeholder='Nhập tên link'
                // validation={{
                //   required: 'Cần nhập link',
                // }}
              ></FormInput>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Thứ tự'>
              <FormInput type='number' disabled={disabled} field='order_index' placeholder='Nhập thứ tự'></FormInput>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Menu cha'>
              <FormSelect
                showSearch
                allowClear
                disabled={disabled}
                field='parent_id'
                placeholder='Chọn menu cha'
                list={(dataListMenu ?? []).map((_) => {
                  return {
                    label: _.menu_name,
                    value: _.menu_id,
                  };
                })}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Quyền'>
              <FormSelect
                showSearch
                allowClear
                disabled={disabled}
                type='text'
                field='function_id'
                placeholder='Chọn quyền'
                list={(dataListFunction ?? []).map((_) => {
                  return {
                    label: _.name,
                    value: _.id,
                  };
                })}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem label='Nhập mô tả'>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default MenusInformation;
