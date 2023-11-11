import moment from 'moment';
import 'moment/locale/vi';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendMailReply } from '../../helpers/call-api';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import splitStringNew from 'pages/Mail/actions/constants';
import Axios from 'axios';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { updateMail } from '../../actions/index';
import { useAuth } from 'context/AuthProvider';
import useQueryString from 'hooks/use-query-string';

import { Tooltip } from 'antd';

import './style2.scss';
const MailItem = ({ item, refeshData, is_last_index, dataOpts, setDataOpts }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const mail_id = useSelector((state) => state.mailbox)?.mail_id;
  const mail_id_open = useSelector((state) => state.mailbox)?.mail_id_open;
  const [query, setQuery] = useQueryString();
  const children_id = query?.children_id ?? '';

  const methods = useForm({
    defaultValues: {
      is_send_to_all: 0,
      parent_id: mail_id,
      mail_subject: item?.mail_subject,
    },
  });

  const DivFile = styled.div`
    margin-top: 20px;
    padding: 15px;
    display: inline-flex;
    align-items: center;
    background: var(--grayColor);
    color: var(--mainColor);
    font-weight: 600;
    cursor: pointer;
  `;

  const SpanFile = styled.span`
    margin-right: 7px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mainColor);
  `;

  const DivContainerReply = styled.div`
    margin: 15px;
  `;

  const { pathname } = useLocation();
  const { watch, setValue, clearErrors } = methods;
  const [isShowReplyBox, setIsShowReplyBox] = useState(false);
  const [dataFile, setDataFile] = useState([]);
  const [isOpenReply, setIsOpenReply] = useState(false);
  const dateSendMail = new Date(moment(item.senddate, 'DD/MM/YYYY HH:mm:ss')).getDate();
  const dateCurrent = new Date().getDate();
  const disabled = false;
  // const [objectRead , setObjectRead] = useState({});

  const styleAttchment = {
    marginRight: '5px',
  };

  const onSubmit = async (payload) => {
    try {
      let label;
      const data = new FormData();
      if (payload.attached_files && payload.attached_files.length > 0) {
        for (let i = 0; i < payload.attached_files.length; i++) {
          data.append('file', payload.attached_files[i]);
        }
      }

      data.append('data', JSON.stringify(payload));
      data.append('data_file', JSON.stringify(dataFile));
      let result = await sendMailReply(data);
      if (result) {
        setQuery({
          children_id: result?.mail_id,
        });
      }
      setIsShowReplyBox(false);
      refeshData();
      label = 'Gửi mail';
      methods.reset({
        is_send_to_all: 0,
      });

      toast.success(`${label} thành công!!!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      toast.error(error ? error.message : 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const handleOnchangeValueEmail = (e, opts) => {
    let checkAll = (opts || []).find((p) => p.value == 'sendAll');
    let optsFilter = (opts || []).filter((user) => user && Object.keys(user).length !== 0);

    let newDataOpts = (dataOpts || []).map((k) => {
      let options = k.options && k.options.length > 0 ? k.options : [];
      options = checkAll
        ? (options || []).map((x) => ({ ...x, disabled: true }))
        : (options || []).map((x) => ({ ...x, disabled: false }));
      if (k && k.options && k.options.length) k.options = options;
      return {
        ...k,
      };
    });
    setDataOpts(newDataOpts);
    if (checkAll) {
      setValue('recipient_email', [{ label: 'Gửi cho tất cả ', value: 'sendAll' }]);
      setValue('is_send_to_all', 1);
      clearErrors('recipient_email');
    } else {
      setValue('recipient_email', optsFilter);
      clearErrors('recipient_email');
    }
  };

  const handleSelectFileUpload = (e) => {
    const target = e.target || e.srcElement;
    let attached_files = watch('attached_files') || [];

    if (target.value.length > 0) {
      const data_file = [...dataFile];
      const file_upload = [...attached_files];
      for (let i = 0; i < e.target.files.length; i++) {
        data_file.push({
          file: e.target.files[i],
          attachment_name: e.target.files[i].name,
        });
        file_upload.push(e.target.files[i]);
      }

      setDataFile(data_file);
      setValue('attached_files', file_upload);
      e.target.value = null;
    }
  };

  const handleDeleteFile = (index, item) => {
    let save_fileattachment = watch('save_fileattachment') || [];
    let attached_files = watch('attached_files') || [];

    const save_att_file = [...save_fileattachment];
    const att_file = [...attached_files];
    const data_file = [...dataFile];
    data_file.splice(index, 1);
    setDataFile(data_file);
    att_file.splice(index, 1);
    setValue('attached_files', att_file);
    if (save_att_file.length > 0) {
      const index_att = save_att_file.findIndex((item_att) => item_att.attachment_id == item.attachment_id);
      save_att_file.splice(index_att, 1);
      setValue('save_fileattachment', save_att_file);
    }
  };

  const handleClickShowReplyBox = (type) => {
    setValue('recipient_email', []);
    setValue('isReplyAll', false);
    setValue('optionSelectedSend', []);
    if (type == 'reply_all') {
      if (item?.is_send_to_all && item?.arrUser[0] === 'sendAll') {
        // setValue('recipient_email', [{ label: 'Gửi cho tất cả ', value: 'sendAll' }]);
        handleOnchangeValueEmail(null, [{ label: 'Gửi cho tất cả ', key: 'sendAll', value: 'sendAll' }]);
        setValue('optionSelectedSend', [{ label: 'Gửi cho tất cả ', key: 'sendAll' }]);
      } else {
        handleOnchangeValueEmail(null, item?.arrUserInsert);
        // setValue('recipient_email', item?.arrUserInsert);
        setValue('optionSelectedSend', item?.arrUserInsert);
      }
      setValue('isReplyAll', true);
      setIsShowReplyBox(true);
    } else {
      // Nếu người gửi của item email này là bản thân người đăng nhập thì sẽ lấy userReplyDefault làm người nhận
      if (item?.user_sender == user?.user_name) {
        let { userReplyDefault, userNameReplyDefault } = item || {};
        if (userNameReplyDefault == user?.user_name) {
          setValue('recipient_email', item?.arrUserInsert);
          setValue('optionSelectedSend', item?.arrUserInsert);
          setValue('isReplyAll', false);
          setIsShowReplyBox(true);
        } else {
          setValue('recipient_email', [userReplyDefault]);
          setValue('optionSelectedSend', [userReplyDefault]);
          setValue('isReplyAll', false);
          setIsShowReplyBox(true);
        }
      } else {
        setValue('recipient_email', [{ key: `USER-${item?.user_sender}` }]);
        setValue('optionSelectedSend', [{ key: `USER-${item?.user_sender}` }]);
        setValue('isReplyAll', false);
        setIsShowReplyBox(true);
      }
    }
  };
  const handleCancel = () => {
    setIsShowReplyBox(false);
    methods.reset();
  };

  const download = (path) => {
    Axios.get(path.attachment_path, {
      responseType: 'blob',
    }).then(function (response) {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers['content-type'],
        }),
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', path.attachment_name);
      document.body.appendChild(link);
      link.click();
    });
  };

  const handleOpenIDEmailOpen = (item) => {
    if (!item.parent_id) {
      setQuery({
        children_id: item?.mail_id,
      });
    } else {
      setQuery({
        children_id: item?.mail_id,
      });
    }
  };

  const UpdateRead = useCallback(() => {
    if (children_id) {
      if ((children_id || 0) == item?.mail_id) {
        dispatch(updateMail(children_id));
        refeshData(true);
      }
    }
  }, [children_id]);

  useEffect(UpdateRead, [UpdateRead]);

  useEffect(() => {
    if (is_last_index == true) {
      if (!item.parent_id) {
        setQuery({
          children_id: item?.mail_id,
        });
      } else {
        setQuery({
          children_id: item?.mail_id,
        });
      }

      if (localStorage.getItem('isReply') || localStorage.getItem('isReplyAll')) {
        setValue('recipient_email', []);
        setValue('isReplyAll', false);
        setValue('optionSelectedSend', []);
        if (localStorage.getItem('isReplyAll') == 'true') {
          if (item?.is_send_to_all && item?.arrUser[0] === 'sendAll') {
            // setValue('recipient_email', [{ label: 'Gửi cho tất cả ', value: 'sendAll' }]);
            handleOnchangeValueEmail(null, [{ label: 'Gửi cho tất cả ', key: 'sendAll', value: 'sendAll' }]);
            setValue('optionSelectedSend', [{ label: 'Gửi cho tất cả ', key: 'sendAll' }]);
          } else {
            handleOnchangeValueEmail(null, item?.arrUserInsert);
            // setValue('recipient_email', item?.arrUserInsert);
            setValue('optionSelectedSend', item?.arrUserInsert);
          }
          setValue('isReplyAll', true);
          setIsShowReplyBox(true);
        } else {
          if (item?.user_sender == user?.user_name) {
            let { userReplyDefault, userNameReplyDefault } = item || {};
            if (userNameReplyDefault == user?.user_name) {
              setValue('recipient_email', item?.arrUserInsert);
              setValue('optionSelectedSend', item?.arrUserInsert);
              setValue('isReplyAll', false);
              setIsShowReplyBox(true);
            } else {
              setValue('recipient_email', [userReplyDefault]);
              setValue('optionSelectedSend', [userReplyDefault]);
              setValue('isReplyAll', false);
              setIsShowReplyBox(true);
            }
          } else {
            setValue('recipient_email', [{ key: `USER-${item?.user_sender}` }]);
            setValue('optionSelectedSend', [{ key: `USER-${item?.user_sender}` }]);
            setValue('isReplyAll', false);
            setIsShowReplyBox(true);
          }
        }
        localStorage.removeItem('isReply');
        localStorage.removeItem('isReplyAll');
      }
    }
  }, [item, is_last_index, localStorage.getItem('isReply') || localStorage.getItem('isReplyAll')]);

  const Checkreply = (props) => {
    let { item = {}, isShowReplyBox = false } = props;
    return (
      <>
        {!isShowReplyBox ? (
          <div className='bw_btn_group bw_mt_3'>
            {/* {
                        item?.user_sender == user?.user_name ? null : <button className="bw_btn bw_reply_mail" onClick={() => handleClickShowReplyBox('reply')}><span className="fi fi-rr-reply-all" /> Trả lời</button>
                    } */}
            <button className='bw_btn bw_reply_mail' onClick={() => handleClickShowReplyBox('reply')}>
              <span className='fi fi-rr-reply-all' /> Trả lời
            </button>
            <button className='bw_btn bw_reply_mail' onClick={() => handleClickShowReplyBox('reply_all')}>
              Trả lời tất cả
            </button>
          </div>
        ) : null}
      </>
    );
  };

  // useEffect(() => {
  //     if (localStorage.getItem("isReply") || localStorage.getItem("isReplyAll")) {
  //         setValue('recipient_email', []);
  //         setValue('isReplyAll', false);
  //         setValue('optionSelectedSend', []);
  //         if (localStorage.getItem("isReplyAll") == 'true') {
  //             if (item?.is_send_to_all && item?.arrUser[0] === 'sendAll') {
  //                 // setValue('recipient_email', [{ label: 'Gửi cho tất cả ', value: 'sendAll' }]);
  //                 handleOnchangeValueEmail(null, [{ label: 'Gửi cho tất cả ', key: 'sendAll', value: 'sendAll' }])
  //                 setValue('optionSelectedSend', [{ label: 'Gửi cho tất cả ', key: 'sendAll' }]);
  //             } else {
  //                 handleOnchangeValueEmail(null, item?.arrUserInsert)
  //                 // setValue('recipient_email', item?.arrUserInsert);
  //                 setValue('optionSelectedSend', item?.arrUserInsert);
  //             }
  //             setValue('isReplyAll', true);
  //             setIsShowReplyBox(true);
  //         } else {
  //             setValue('recipient_email', [{ key: `USER-${item?.user_sender}` }])
  //             setValue('optionSelectedSend', [{ key: `USER-${item?.user_sender}` }])
  //             setValue('isReplyAll', false);
  //             setIsShowReplyBox(true);
  //         }
  //         console.log('sfdafsdf')
  //     //   localStorage.removeItem("isReply")
  //     //   localStorage.removeItem("isReplyAll")
  //     }
  //   }, [localStorage.getItem("isReply") || localStorage.getItem("isReplyAll")])

  return (
    <div className={`bw_items_frm bw_items_email_detail  ${item?.is_read ? null : 'bw_non_read'}`} key={item?.key}>
      <div className={`bw_collapse ${item?.mail_id == children_id ? `bw_active` : null}`}>
        <div className='bw_collapse_title custom_detail_title_mail' onClick={() => handleOpenIDEmailOpen(item)}>
          <div className='bw_item_comments bw_items_mail'>
            <img src={item?.picture_sender} />
            <h3>{item?.sender}</h3>
            <Tooltip title={`${item?.resListUserToolTip}`} overlayStyle={{ maxWidth: '100%' }} placement='bottomLeft'>
              <span>Tới : {item?.resListUser}</span>
            </Tooltip>
          </div>
          <div className='bw_item_comments bw_items_mail'>
            <span className='custom_time_mail'>
              {dateCurrent === dateSendMail
                ? moment(item.senddate, 'DD/MM/YYYY HH:mm:ss').fromNow()
                : moment(item.senddate, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm')}
            </span>
          </div>
        </div>
        <div className='bw_collapse_panel'>
          <div className='bw_content_notice'>
            <div className='bw_mail_content' dangerouslySetInnerHTML={{ __html: item?.mail_content }} />
            <div className='bw_file_notice'>
              {item &&
                item?.data_attachment &&
                item?.data_attachment?.length > 0 &&
                (item?.data_attachment || [])?.map((item) => {
                  return (
                    <DivFile onClick={() => download(item)} style={styleAttchment}>
                      <SpanFile className='fi fi-rr-file-invoice ' />
                      {item?.attachment_name}
                    </DivFile>
                  );
                })}
            </div>
            {/* <div className="bw_file_notice">
                            <a href="#!">
                                <span className="fi fi-rr-file-invoice " />
                                Quyet-dinh-khen-thuong.docx
                            </a>
                        </div> */}
            {/* <div className="bw_btn_group bw_mt_3">
                            <button className="bw_btn bw_reply_mail" onClick={() => handleClickShowReplyBox('reply')}><span className="fi fi-rr-reply-all" /> Trả lời</button>
                            <button className="bw_btn bw_reply_mail" onClick={() => handleClickShowReplyBox('reply_all')} >Trả lời tất cả</button>
                        </div> */}
            <Checkreply item={item} isShowReplyBox={isShowReplyBox} />
            {isShowReplyBox ? (
              <FormProvider {...methods}>
                <div className='bw_main_wrapp'>
                  <div className='bw_row'>
                    <div className='bw_col_12'>
                      <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <BWAccordion title='Soạn thư' id='compose'>
                          {/* <div className='bw_items_frm'>
                                                        <div className='bw_collapse bw_active'>
                                                            <DivContainerReply className='bw_collapse_panel'> */}

                          <div className='bw_row'>
                            <div className='bw_col_12'>
                              <FormItem label='Người nhận' isRequired>
                                <FormSelect
                                  type='text'
                                  field='recipient_email'
                                  validation={{
                                    required: 'Người nhận là bắt buộc',
                                  }}
                                  disabled={disabled}
                                  list={dataOpts}
                                  mode='multiple'
                                  onChange={(e, opts) => handleOnchangeValueEmail(e, opts)}
                                  maxTagCount={'responsive'}
                                />
                              </FormItem>
                            </div>

                            <div className='bw_col_12'>
                              <FormItem label='Tiêu đề email' isRequired>
                                <FormInput
                                  type='text'
                                  field='mail_subject'
                                  placeholder='Nhập tiêu đề'
                                  validation={{
                                    required: 'Tiêu đề là bắt buộc',
                                  }}
                                  disabled={disabled}
                                />
                              </FormItem>
                            </div>
                            <div className='bw_col_12 bw_mb_2'>
                              <FormEditor
                                field='mail_content'
                                disabled={disabled}
                                validation={{
                                  required: 'Vui lòng nhập nội dung của mail',
                                }}
                              />
                            </div>

                            <div className='bw_col_12 bw_mb_2'>
                              <input
                                multiple={true}
                                onChange={(e) => handleSelectFileUpload(e)}
                                id='actual-btn_file'
                                accept='.png,.jpg,.jpeg,.pdf,.xls,.xlsx,.doc,.docx'
                                type='file'
                                hidden></input>
                              <label htmlFor='actual-btn_file' className='mail_file'>
                                <i className='fa fa-paperclip mr-2' />
                                File đính kèm
                              </label>
                            </div>

                            <div className='bw_col_12 bw_mb_2'>
                              <div
                                style={{
                                  marginTop: 4,
                                  display: 'flex',
                                  flexDirection: 'row',
                                  flexWrap: 'wrap',
                                }}>
                                {dataFile.map((item, index) => {
                                  return (
                                    <div key={index + ''} className='mail_view_fileAttachment'>
                                      <div className='mail_content_fileAttchment'>
                                        <i className='fa fa-file' aria-hidden='true'></i>
                                        <div className='mail_name_file'>
                                          <span>{splitStringNew(item.attachment_name, 20)}</span>
                                        </div>
                                        <i
                                          onClick={() => handleDeleteFile(index, item)}
                                          className='fa fa-trash trash_attchment'
                                          aria-hidden='true'></i>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className='bw_col_12'>
                              <div className='bw_flex bw_align_items_center bw_btn_group'>
                                <button
                                  className='bw_btn bw_btn_success bw_send_mail'
                                  style={{ marginRight: 5, marginBottom: 10 }}
                                  type='submit'>
                                  <span className='fi fi-rr-envelope-plus'></span>
                                  Gửi
                                </button>
                                <button
                                  className='bw_btn_outline bw_btn_outline_danger'
                                  onClick={() => handleCancel()}
                                  style={{ marginBottom: 10 }}>
                                  Huỷ
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* </DivContainerReply>
                                                        </div>
                                                    </div> */}
                        </BWAccordion>
                      </form>
                    </div>
                  </div>
                </div>
              </FormProvider>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailItem;
