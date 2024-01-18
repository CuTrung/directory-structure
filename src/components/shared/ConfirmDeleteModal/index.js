import { useDispatch, useSelector } from 'react-redux';
import { hideConfirmModal } from 'reduxApp/actions/global';
import styled from 'styled-components';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

const ConfirmModal = () => {
  const dispatch = useDispatch();
  const { confirmMessage, confirmCallback, labelAccept, labelRefuse } = useSelector((state) => state.global);

  return (
    Array.isArray(confirmMessage) &&
    confirmMessage.length > 0 && (
      <div className='bw_modal bw_modal_open' id='bw_notice_del'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal bw_border_bottom'>
            <h3>
              <span className='bw_icon_notice'>
                <i className='fi fi-rr-bell'></i>
              </span>{' '}
              Thông báo
            </h3>
            <span
              onClick={() => {
                dispatch(hideConfirmModal());
              }}
              className='bw_close_modal fi fi-rr-cross-small'></span>
          </div>
          <div className='bw_main_modal bw_text_center'>
            {confirmMessage.map((p, idx) => (
              <ModalContent key={idx}>{p}</ModalContent>
            ))}
          </div>
          <div className='bw_footer_modal bw_justify_content_center'>
            <button
              onClick={() => {
                confirmCallback();
                dispatch(hideConfirmModal());
              }}
              className='bw_btn bw_btn_danger'>
              {labelAccept ?? 'Xác nhận xóa'}
            </button>
            <button
              onClick={() => {
                dispatch(hideConfirmModal());
              }}
              className='bw_btn_outline bw_close_modal'>
              {labelRefuse ?? 'Quay về'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmModal;
