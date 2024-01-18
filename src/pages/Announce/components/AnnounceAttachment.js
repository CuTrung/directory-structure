import BWAccordion from 'components/shared/BWAccordion/index';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { downloadAttachment } from '../helpers/call-api';
import { notification } from 'antd';
import styled from 'styled-components';

const AnnounceAttachment = ({ disabled }) => {
  const DivFile = styled.div`
    padding: 0px 15px;
    display: inline-flex;
    align-items: center;
    border-radius: 5px;
    background: var(--grayColor);
    color: var(--mainColor);
    font-weight: 600;
    cursor: pointer;
  `;
  const SpanFile = styled.span`    
    line-height: 40px;
    max-width: 160px;
    width: 160px; 
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `;
  const methods = useFormContext();
  const { watch } = methods;

  const uploadFiles = (e) => {
    const files = e.target.files;
    for (let i = 0; i < Object.keys(files).length; i++) {
      if (files[i].name.match(/\.(jpg|png)$/i)) {
        let temp = URL.createObjectURL(files[i]);
      }
    }
    
    console.log(files)
    methods.setValue('attachment_list', [...(methods.watch('attachment_list') ?? []), ...files]);
  };

  const handleRemoveFile = (idx) => {
    const files = methods.getValues('attachment_list');
    methods.setValue(
      'attachment_list',
      files.filter((_, i) => i != idx),
    );
  };

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

  return (
    <BWAccordion title='Tập tin đính kèm' id='bw_hs'>
      
      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled ? (
          <label className='bw_choose_image_banner'>
            <input
              type='file'
              multiple
              accept='file_extension|audio/*|video/*|image/*|media_type'
              onChange={uploadFiles}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        ) : null}
        {(watch('attachment_list') ?? [])?.map((item, i) => (
          <div className='bw_card_items bw_green' key={i}
            style={{
              padding: ' 15px 20px',
              alignSelf: 'flex-start',
              margin: '0 10px 10px 0'
            }}
          >
            {item instanceof File ? (
              <DivFile>
                <SpanFile>{item.name}</SpanFile>
              </DivFile>
            ) : (
              <DivFile
                onClick={() => handleDownloadFile(item)}>
                <SpanFile>{item.attachment_name}</SpanFile>
              </DivFile>
            )}
            {!disabled ? (
              <span className='bw_remove_image bw_red' onClick={() => handleRemoveFile(i)}>
                <i className='fi fi-rr-trash'></i>
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </BWAccordion>
  );
};

export default AnnounceAttachment;
