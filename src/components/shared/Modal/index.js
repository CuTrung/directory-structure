import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import BWButton from '../BWButton/index';
import styled from 'styled-components';
import { isFunctionComponent } from 'utils/helpers.util';

const ModalStyled = styled.div`
  .bw_modal_container {
    width: ${(props) => props.width ?? ''}!important;
    max-width: ${(props) => props.width ?? ''}!important;
  }
`;
const Modal = ({ children, open, onClose, header: Header, footer: Footer, width }) => {
  return (
    <React.Fragment>
      <ModalStyled width={width} className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal bw_border_bottom'>
            {isFunctionComponent(Header) ? <Header /> : <h3>{Header}</h3>}
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} />
          </div>
          <div className='bw_main_modal'>{children}</div>
          <div className='bw_footer_modal bw_justify_content_right'>
            {isFunctionComponent(Footer) ? <Footer /> : <h3>{Footer}</h3>}
            <BWButton type='button' outline className='bw_close_modal' content={'Đóng'} onClick={onClose} />
          </div>
        </div>
      </ModalStyled>
    </React.Fragment>
  );
};
Modal.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;
