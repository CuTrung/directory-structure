import React from 'react';
import PropTypes from 'prop-types';
import BWButton from '../BWButton/index';

const BWModal = ({ className, children, open, onClose, onConfirm, header, footer }) => {
  return (
    <React.Fragment>
      <div className={`bw_modal ${className} ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal bw_border_bottom'>
            <h3>{header}</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} />
          </div>
          <div className='bw_main_modal bw_text_center'>{children}</div>
          <div className='bw_footer_modal bw_justify_content_center'>
            {footer && <BWButton type="danger" content={footer} onClick={onConfirm} /> }
            <BWButton type="" outline className='bw_close_modal' content='Quay về' onClick={onClose} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
BWModal.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default BWModal;
