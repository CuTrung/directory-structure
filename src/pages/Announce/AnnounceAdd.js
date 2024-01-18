import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { createAnnounce, getDetail, updateAnnounce } from './helpers/call-api';
import { AnnounceContent, AnnounceInfo } from './components/AnnounceForm';
import AnnounceSendUser from './components/AnnounceSendUser';
import AnnounceReview from './components/AnnounceReview';
import AnnounceAttachment from './components/AnnounceAttachment';
import { showToast } from 'utils/helpers';

const AnnounceAdd = () => {
  const methods = useForm({});
  const { handleSubmit } = methods;
  const { pathname } = useLocation();
  const { id: announce_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_send_to_all = payload.is_send_to_all ? 1 : 0;
      const data = new FormData();
      for (var key in payload) {
        if (!payload[key]) {
          continue;
        }
        if (key === 'attachment_list') {
          payload[key].forEach((element) => {
            data.append(key, element instanceof File ? element : JSON.stringify(element));
          });
        } else if (key === 'review_level_list' || key === 'department' || key === 'user') {
          payload[key].forEach((element) => {
            data.append(key, JSON.stringify(element));
          });
        } else data.append(key, payload[key]);
      }

      let label;
      if (announce_id) {
        await updateAnnounce(announce_id, data);
        label = 'Chỉnh sửa';
      } else {
        await createAnnounce(data);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          is_send_to_all: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (announce_id) {
      getDetail(announce_id).then((value) => {
        if (!value?.is_send_to_all) {
          value.is_send_to_all = 0;
        }
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        is_send_to_all: 1,
      });
    }
  }, [announce_id]);

  const detailForm = [
    {
      title: 'Thông tin thông báo',
      id: 'information',
      component: AnnounceInfo,
      fieldActive: ['announce_title', 'announce_type_id', 'company_id', 'published_date'],
    },
    {
      title: 'Nội dung thông báo',
      id: 'announce_content',
      component: AnnounceContent,
      fieldActive: ['announce_content'],
    },
    {
      id: 'status',
      title: 'Tập tin đính kèm',
      component: AnnounceAttachment,
      fieldActive: ['attachment_list'],
    },
    {
      id: 'send_user',
      title: 'Danh sách nhận thông báo',
      component: AnnounceSendUser,
      fieldActive: ['is_send_to_all'],
    },
    {
      id: 'review',
      title: 'Mức duyệt',
      component: AnnounceReview,
      fieldActive: ['review_level_list'],
    },
  ];

  useEffect(loadDetail, [loadDetail]);
  let isReviewed = methods.watch('review_level_list.0.is_review') !== -1;

  const actions = [
    {
      globalAction: true,
      className: 'bw_btn bw_btn_success',
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : announce_id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      disabled: disabled && isReviewed,
      onClick: () => {
        if (disabled) window._$g.rdr(`/announce/edit/${announce_id}`);
        else handleSubmit(onSubmit);
      },
    },
  ];
  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} actions={actions} />
    </FormProvider>
  );
};

export default AnnounceAdd;
