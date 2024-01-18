import React from 'react';
import BWModal from 'components/shared/BWModal/index';
import styled from 'styled-components';

const ModalContent = styled.p`
  margin-bottom: 0;
`;


const headerModal = (
    <>
        <span className='bw_icon_notice'>
            <i className='fi fi-rr-bell'></i>
        </span>{' '}
        Thông báo
    </>
);

function BWModalDelete({ onCloseModal, handleDelete }) {
  return (
    <BWModal onClose={onCloseModal} open={true} header={headerModal} footer='Tôi muốn xóa' onConfirm={handleDelete}>
      <ModalContent>Bạn có thật sự muốn xóa? </ModalContent>
      <ModalContent>Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.</ModalContent>
    </BWModal>
  );
}

export default BWModalDelete;
