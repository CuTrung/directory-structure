import React, { useCallback, useEffect, useState } from 'react';
import { createAnnounceUserView, downloadAttachment, getAnnounceView } from './helpers/call-api';
import { notification } from 'antd';
import { getErrorMessage } from 'utils/index';
import _ from 'lodash';
import _500img from 'assets/502.png';
import Loading from 'components/shared/Loading/index';
import './styles/custom.scss';
import BWImage from 'components/shared/BWImage';

const AnnounceViewTable = ({ announce_id }) => {
  const [loading, setLoading] = useState(true);
  const [announceData, setAnnounceData] = useState({});

  const handleReadAnnounce = async (value) => {
    try {
      if (value.is_read === 0) {
        await createAnnounceUserView(value);
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };
  const loadDetail = useCallback(() => {
    setLoading(true);
    if (announce_id)
      getAnnounceView(announce_id)
        .then((value) => {
          if (value) {
            setAnnounceData(value);
            handleReadAnnounce(value);
          }
        })
        .finally(() => {
          setLoading(false);
        });
  }, [announce_id]);
  useEffect(loadDetail, [loadDetail]);

  const handleDownloadFile = async (item) => {
    try {
      await downloadAttachment(item.announce_attachment_id).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.attachment_name);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải tập tin.' });
    }
  };
  if (loading) {
    return <Loading />;
  } else if (announceData && !_.isEmpty(announceData))
    return (
      <div className='bw_detail_notice'>
        <h2 className='bw_title_news_detail'>{announceData?.announce_title}</h2>
        <div className='bw_creater bw_flex bw_align_items_center bw_justify_content_center'>
          <BWImage src='bw_image/user_admin.png' />
          <h4>{announceData?.fullname}</h4>
          <span style={{ margin: '0 0 6px' }}>vào {announceData?.created_date}</span>
        </div>
        <div className='bw_main_content_news custom-editor-text'>
          <div dangerouslySetInnerHTML={{ __html: announceData?.announce_content }} />
          <div className='bw_file_notice'>
            {(announceData?.attachment_list || []).map((attachment, idx) => {
              return (
                <a key={idx} onClick={() => handleDownloadFile(attachment)}>
                  <span className='fi fi-rr-file-invoice' />
                  {attachment.attachment_name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className='bw_detail_notice'>
        <div className='bw_text_center'>
          <img src={_500img} alt={2} style={{ width: '90%' }} />
          <h2>Bạn không có quyền xem thông báo này!</h2>
        </div>
      </div>
    );
};

export default AnnounceViewTable;
