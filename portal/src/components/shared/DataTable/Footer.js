import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ current, totalPage }) => {
  return (
    <div className='bw_row bw_mt_2 bw_show_table_page'>
      <div className='bw_col_6'>
        <p>
          Show {current}/{totalPage} records
        </p>
      </div>
      <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
        <div className='bw_nav_table'>
          <button className={current === 0 ? 'bw_active' : null}>
            <span className='fi fi-rr-angle-small-left'></span>
          </button>
          <input type='number' value='1' step='1' />
          <span className='bw_all_page'>
            {current} / {totalPage}
          </span>
          <button className={current === totalPage ? 'bw_active' : null}>
            <span className='fi fi-rr-angle-small-right'></span>
          </button>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  current: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
};

Footer.defaultProps = {
  current: 1,
  totalPage: 1,
};

export default Footer;
