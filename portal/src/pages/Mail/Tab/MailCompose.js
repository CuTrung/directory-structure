/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createMail, getDetail, getOptionDepartment, getOptionUser, upload } from '../helpers/call-api';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import splitStringNew from 'pages/Mail/actions/constants';
import { setTypeMail } from '../actions/index';
import { useSelector, useDispatch } from 'react-redux';
import MailMenu from './MailMenu';
import '../style.scss';
import { readImageAsBase64 } from 'utils/helpers';

const MailCompose = () => {
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {
      is_send_to_all: 0,
      parent_id: 0,
    },
  });

  const { watch, setValue, clearErrors, getValues, setError } = methods;

  const { pathname } = useLocation();
  const history = useHistory();
  const { id: mail_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const [dataOpts, setDataOpts] = useState([]);
  const [dataFile, setDataFile] = useState([]);

  const getInitData = async () => {
    try {
      let data = [{ label: 'Gửi cho tất cả ', value: 'sendAll' }];
      let nameOpts = ['Danh sách phòng ban', 'Danh sách nhân viên'];

      let dataDepartment = await getOptionDepartment();
      dataDepartment = dataDepartment.map(({ id, name }) => ({ value: `PB-${id}`, label: name }));

      let dataUser = await getOptionUser();
      dataUser = dataUser.map(({ id, name }) => ({ value: `USER-${id}`, label: `${id} - ${name}` }));
      let arrayOpts = [[...dataDepartment], [...dataUser]];

      for (let i = 0; i < nameOpts.length; i++) {
        let obj = {};
        let label = nameOpts[i];
        obj.label = label;
        obj.options = arrayOpts[i];
        data.push(obj);
      }
      setDataOpts(data);
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

  useEffect(() => {
    getInitData();
  }, []);

  const onSubmit = async (payload) => {
    try {
      if (payload.is_draft == 1) {
        if (!payload.recipient_email) {
          setError('recipient_email', { type: 'custom', message: 'Người nhận là bắt buộc. ' });
          return;
        }
        //     // if (!payload.mail_subject) {
        //     //     setError('mail_subject', { type: 'custom', message: "Tên tiêu đề là bắt buộc. " });
        //     // }
        //     if (!payload.mail_content) {
        //         setError('mail_content', { type: 'custom', message: "Nội dung email là bắt buộc. " });
        //     }

        // }
        // if (!payload.mail_content) {
        //     setError('mail_content', { type: 'custom', message: "Nội dung email là bắt buộc. " });
        //     return;
      }
      let label;
      const data = new FormData();
      if (payload.attached_files && payload.attached_files.length > 0) {
        for (let i = 0; i < payload.attached_files.length; i++) {
          data.append('file', payload.attached_files[i]);
        }
      }

      data.append('data', JSON.stringify(payload));
      data.append('data_file', JSON.stringify(dataFile));
      await createMail(data);
      label = 'Gửi mail';
      methods.reset({
        is_send_to_all: 0,
      });
      let is_draft = payload?.is_draft;
      if (is_draft == 1) {
        localStorage.setItem('typeMail', 'draft');
        dispatch(setTypeMail('draft'));
        history.push(`/mail/draft`);
        label = 'Lưu thư nháp';
      } else {
        localStorage.setItem('typeMail', 'send');
        dispatch(setTypeMail('send'));
        history.push(`/mail/send`);
      }
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
      setValue('recipient_email', opts);
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

  const handleSubmitDraft = () => {
    let payload = { ...getValues(), is_draft: 1 };
    onSubmit(payload);
  };

  const cancelCompose = () => {
    localStorage.setItem('typeMail', 'send');
    dispatch(setTypeMail('send'));
    history.push(`/mail`);
  };

  const handleUploadImageDesc = (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await upload({
          base64: imageUrl,
          folder: 'files',
          includeCdn: true,
        });
        success(imageUpload);
      } catch (error) {
        failure(error);
      }
    });
  };
  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <div className='bw_row'>
          <MailMenu />
          <div className='bw_col_9'>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <BWAccordion title='Soạn thư' id='compose' isRequired>
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
                      handleUploadImageDesc={handleUploadImageDesc}
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
                      <button className='bw_btn bw_btn_success bw_send_mail' style={{ marginRight: 5 }} type='submit'>
                        <span className='fi fi-rr-envelope-plus'></span>
                        Gửi
                      </button>
                      <button
                        className='bw_btn bw_btn_success bw_send_mail'
                        style={{ marginRight: 5 }}
                        type='button'
                        onClick={() => handleSubmitDraft()}>
                        <span className='fa fa-paper-plane mr-2'></span>
                        Nháp
                      </button>
                      <button
                        className='bw_btn_outline bw_btn_outline_danger'
                        type='button'
                        onClick={() => cancelCompose()}>
                        Huỷ
                      </button>
                    </div>
                  </div>
                </div>
              </BWAccordion>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default MailCompose;
