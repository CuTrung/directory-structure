import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotify } from 'reduxApp/actions/global';
import NotifySection from 'layouts/notify/components/NotifySection';
import classNames from 'classnames/bind';
import useOutsideClick from 'hooks/use-outside-picker';
import styled from 'styled-components';

const Wiget = styled.span`
  h3 {
    line-height: 1.2;
  }
`;

const NotifyCommon = () => {
  const ref = useRef();
  const dispatch = useDispatch();
  const { openNotify, typeNotify } = useSelector((state) => state.global);

  useOutsideClick(ref, () => {
    dispatch(hideNotify());
  });

  return (
    <div ref={ref} className={classNames('bw_box_list', { bw_show: openNotify })}>
      {openNotify && (
        <Wiget>
          <h3>
            {typeNotify?.label} <i onClick={() => dispatch(hideNotify())} className='fi fi-rr-cross'></i>
          </h3>
          <NotifySection />
        </Wiget>
      )}
    </div>
  );
};

export default NotifyCommon;
