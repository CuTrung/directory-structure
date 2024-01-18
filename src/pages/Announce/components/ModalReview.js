import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { REVIEW_TYPE } from '../utils/constants';
import { approvedReview } from '../helpers/call-api';
import { showToast } from 'utils/helpers';

export default function ModalReview({ itemReviewLevel, setShowModalReview, onRefresh }) {
  const methods = useForm();
  const { watch, setValue } = methods;
  useEffect(() => {
    if (itemReviewLevel) {
      setValue('review_level', itemReviewLevel);
    }
  }, [itemReviewLevel]);
  const handleApprove = async (value) => {
    try {
      if (!watch('review_level.review_note')) {
        showToast.warning('Ghi chú duyệt là bắt buộc!');
        return;
      }
      await approvedReview({ ...watch('review_level'), type: value });
      showToast.success('Cập nhật trạng thái duyệt thành công!');
    } catch (error) {
      showToast.error('Đã có lỗi xảy ra. Vui lòng F5 thử lại!');
    }
    setShowModalReview(false);
    onRefresh();
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open' id='bw_confirm_modal'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>Duyệt thông báo</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModalReview(false)} />
          </div>
          <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
              <label>Ghi chú duyệt</label>
              <FormTextArea
                field={`review_level.review_note`}
                placeholder='Nhập ghi chú'
                validation={{
                  required: 'Ghi chú duyệt là bắt buộc',
                }}
              />
            </div>
          </div>
          <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => handleApprove(REVIEW_TYPE.ACCEPT)}>
              <span className='fi fi-rr-check' /> Duyệt
            </button>
            <button type='button' className='bw_btn bw_btn_danger' onClick={() => handleApprove(REVIEW_TYPE.REJECT)}>
              <span className='fi fi-rr-check' /> Không duyệt
            </button>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={() => setShowModalReview(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
