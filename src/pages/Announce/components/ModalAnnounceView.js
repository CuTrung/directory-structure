import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCountNotRead } from 'pages/Announce/actions';

import styled from 'styled-components';
import { getErrorMessage } from 'utils/index';
import defaultImage from '../../../assets/bw_image/default_img.png'
const Section = styled.a`
  background: ${(props) => (props.isActive ? '#DEF1EE' : undefined)};
`;

const LineTwo = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpanSection = styled.span`
  display: block;
  font-size: 12px;  
`;
const ModalAnnounceView = ({
  announce,
  announceId,
  handleChangeAnnounceView,
}) => {
  const dispatch = useDispatch();
  let countNotRead = useSelector((state) => state.announce.countNotRead);
  
  const handleReadAnnounce = async (value) => {

    try {
      if (value.is_read === 0) {
        let payload = {}
        payload.count = countNotRead - 1;
        dispatch(setCountNotRead(payload))
        value.is_read = 1;
        value.total_view += 1;
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };

  
  return (
    <Section
      isActive={announceId == announce?.announce_id}
      className={`bw_notice_items ${announce?.is_read ? null : 'bw_active'}`}
      onClick={() => {
        handleReadAnnounce(announce);
        handleChangeAnnounceView(announce);
      }}>
      <img src={announce?.default_picture_url} onError={(e)=>{
        e.onerror = null;
        e.target.src = defaultImage;
      }}/>
      <h3>
        {announce.created_user} - {announce.fullname}
      </h3>
      <SpanSection>{announce.created_date}</SpanSection>
      <h2><LineTwo>{announce.announce_title}</LineTwo></h2>
      <p>
        <span className='fi fi-rr-eye' /> {announce.total_view}        
        {announce.is_read === 1 ?       
            <span className='bw_badge right'>Đã xem</span>
            : <span className='bw_badge bw_badge_primary right'>Chưa xem</span>}
      </p>
    </Section>
  );
};

export default ModalAnnounceView;
