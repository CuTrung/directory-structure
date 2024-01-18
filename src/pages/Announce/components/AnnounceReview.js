import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useAuth } from '../../../context/AuthProvider';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ModalReview from './ModalReview';
import CheckAccess from '../../../navigation/CheckAccess';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { getListReviewByAnnounceTypeId } from '../helpers/call-api';
import { useParams } from 'react-router-dom';
import { checkShowButton } from '../helpers/index';
import { Alert } from 'antd';
function AnnounceReview({ disabled, onRefresh }) {
  const { user } = useAuth();
  const methods = useFormContext();
  const { id: announce_id } = useParams();
  const { watch, setValue, formState, control } = methods;
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);
  const [listReview, setListReview] = useState(false);
  const listReviewAnnounceType = watch('review_level_list');
  useEffect(() => {
    if (watch('announce_type_id')) {
      getListReviewByAnnounceTypeId({ announce_type_id: watch('announce_type_id'), announce_id }).then((data) => {
        setValue('review_level_list', data);
        if (data.length > 0) {
          setListReview(true);
        } else setListReview(false);
      });
    }
  }, [watch('announce_type_id')]);
  const handleReview = (item) => {
    setItemReviewLevel(
      Object.assign({ ...item, announce_id: watch('announce_id'), announce_type_id: watch('announce_type_id') }),
    );
    setShowModalReview(true);
  };

  const { fields } = useFieldArray({
    control,
    name: 'review_level_list',
  });

  return (
    <>
      <BWAccordion title='Mức duyệt' id='bw_stocks_in_review' isRequired>
        <div className='bw_table_responsive'>
          <table className='bw_table'>
            <thead>
              <tr>
                <th className='bw_sticky bw_check_sticky'>STT</th>
                <th>Mức duyệt</th>
                <th>Người duyệt</th>
                <th className='bw_text_center'>Thao tác</th>
                <th className='bw_text_center'>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {(listReviewAnnounceType ?? []).map((r, idx) => {
                let isCanReview = disabled && user.user_name === watch(`review_level_list.${idx}.review_user`);

                let showButton = checkShowButton(r, idx, listReviewAnnounceType);
                const disabledButton = !(isCanReview && showButton);

                return (
                  <tr key={idx}>
                    <td className='bw_sticky bw_check_sticky bw_text_center'>{idx + 1}</td>
                    <td className='bw_mw_3'>{r.review_level_name}</td>
                    <td>
                      {r.is_auto_review ? (
                        <span>Mức duyệt tự động</span>
                      ) : (
                        <FormSelect
                          className='bw_mw_3'
                          field={`review_level_list.${idx}.review_user`}
                          list={(r?.list_user ?? []).map((e) => ({ value: e.id, label: e.name })) || []}
                          disabled={disabled}
                          defaultValue={r?.review_user}
                          onChange={(e) => {
                            setValue(`review_level_list.${idx}.review_user`, e);
                          }}
                        />
                      )}
                    </td>

                    <td className='bw_text_center'>
                      {r.is_auto_review === 1 ? (
                        <span></span>
                      ) : r.is_review === 1 ? (
                        `Đã duyệt ngày ${r.review_date ? r.review_date : ''}`
                      ) : r.is_review === 0 ? (
                        `Không duyệt ngày ${r.review_date ? r.review_date : ''}`
                      ) : (
                        <CheckAccess permission='SYS_ANNOUNCE_REVIEW'>
                          <button
                            type='button'
                            disabled={disabledButton}
                            className={`${disabledButton ? 'bw_btn' : 'bw_btn_outline bw_btn_outline_success'}`}
                            onClick={() => handleReview(r)}>
                            Duyệt
                          </button>
                        </CheckAccess>
                      )}
                    </td>
                    <td>
                      {r.review_note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!listReview && (
          <Alert
            message='Hình thức tự động duyệt'
            description='Đối với hình thức tự động duyệt, sẽ không cần người duyệt phiếu.'
            type='info'
            showIcon
          />
        )}
        {formState.errors['review_level_list'] && (
          <ErrorMessage message={formState.errors?.review_level_list?.root?.message} />
        )}
      </BWAccordion>
      {showModalReview && (
        <ModalReview
          disabled={disabled}
          itemReviewLevel={itemReviewLevel}
          setShowModalReview={setShowModalReview}
        />
      )}
    </>
  );
}

export default AnnounceReview;
