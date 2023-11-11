import React from 'react';

import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAccordion from 'components/shared/BWAccordion/index';

const MenusStatus = ({ disabled }) => {
  return (
    <BWAccordion title='Trạng thái'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_active' />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_system' />
                <span />
                Hệ thống
              </label>
              {/* <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_business' />
                <span />
                Business
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_can_open_multi_windows' />
                <span />
                Mở nhiều cửa sổ
              </label> */}
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default MenusStatus;
