import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconCollapse = styled.span`
  transform: ${(props) => (props.open ? 'rotate(180deg)' : '')};
  color: ${(props) => (props.open ? '#119480' : '')};
`;

const BWAccordion = ({ style, title, children, id, isRequired = false, componentCustom }) => {
  const [open, setOpen] = useState(true);

  const handleAccordion = () => {
    setOpen(!open);
  };
  
  return (
    <React.Fragment>
      <div id={id} className='bw_items_frm'>
        <div className={`bw_collapse ${open ? 'bw_active' : ''}`}>
          <div className='bw_collapse_title'>
            <IconCollapse open={open} className='fi fi-rr-angle-small-down' onClick={handleAccordion} />
            <h3>
              {title}
              {isRequired && <span className='bw_red'>*</span>}
            </h3>
          </div>
          {open && <div className='bw_collapse_panel'>{children}</div>}
          {componentCustom && componentCustom}
        </div>
      </div>
    </React.Fragment>
  );
};

BWAccordion.propTypes = {
  isRequired: PropTypes.bool,
  title: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default BWAccordion;
