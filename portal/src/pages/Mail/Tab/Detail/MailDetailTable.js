import React, { useEffect } from 'react';
import MailItem from './MailItem';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import '../../style.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setMailIdOpen, updateMail } from '../../actions/index';
import useQueryString from 'hooks/use-query-string';
import { useCallback } from 'react';
const MailDetailTable = ({ data, info, loading, refeshData, dataOpts, setDataOpts }) => {
  const dispatch = useDispatch();
  const mail_id_open = useSelector((state) => state.mailbox)?.mail_id_open;
  const [query, setQuery] = useQueryString();
  const children_id = query?.children_id ?? '';

  if (loading) {
    return (
      <div className='loading_email_custom'>
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <React.Fragment>
      <h1 className='bw_title_notice'>{info?.mail_subject}</h1>
      {/* <p className="bw_time_send">
                <i className="fi fi-rr-clock-two"></i>
                {' '}
                {info?.senddate}
            </p> */}
      {data &&
        data.length > 0 &&
        data.map((item, index) => {
          let is_lastindex = false;
          if (index == data.length - 1 && !children_id) {
            is_lastindex = true;
          }
          return (
            <MailItem
              key={`${item.mail_id}`}
              item={item}
              index={index}
              is_last_index={is_lastindex}
              refeshData={refeshData}
              dataOpts={dataOpts}
              setDataOpts={setDataOpts}
            />
          );
        })}
    </React.Fragment>
  );
};

export default MailDetailTable;
