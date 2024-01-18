import React, { useCallback, useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { deleteAnnounce } from '../helpers/call-api';
import DataTable from 'components/shared/DataTable/index';
import { reviewTypeOptions } from '../utils/constants';
import styled from 'styled-components';

const CustomText = styled.p`
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
`;

const AnnounceTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const jsx_review = useCallback(({ type = '', name = '', avatar = null }) => {
    const findReview = reviewTypeOptions?.find((p) => p?.value === parseInt(type));
    if (findReview) {
      const { label = '', className, icon, colorLabel } = findReview;
      const review_name = `${name ? `${name}` : `Duyệt tự động`}`;
      return (
        <li className={className}>
          <img src={avatar ? `${process.env.REACT_APP_CDN}${avatar}` : 'bw_image/img_cate_default.png'} alt='2' />
          <span className={`fi ${icon}`}></span>
          <p>
            {review_name} <i className={colorLabel}>{label}</i>
          </p>
        </li>
      );
    }
  }, []);
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên thông báo',
        accessor: 'announce_title',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <CustomText>{p?.announce_title}</CustomText>,
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_center',
        accessor: 'announce_type_name',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'is_review',
        formatter: (p) => (
          <ul className='bw_confirm_level'>
            {p.review_user_list && p.review_user_list.length > 0 ? (
              p.review_user_list.map((o) => {
                return jsx_review({
                  type: o?.review_status,
                  ...o,
                });
              })
            ) : p.is_review ? (
              <span className='bw_green'>Tự động duyệt</span>
            ) : (
              <></>
            )}
          </ul>
        ),
      },
    ],
    [],
  );
  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SYS_ANNOUNCE_ADD',
        onClick: () => window._$g.rdr(`/announce/add`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SYS_ANNOUNCE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/announce/detail/${p?.announce_id}`);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SYS_ANNOUNCE_EDIT',
        hidden: (_) => {
          let isEdit = false;
          if (_.is_review !== null) isEdit = false;
          else {
            let countReview = 0;
            if (_.review_user_list && _.review_user_list.length > 0) {
              for (let index = 0; index < _.review_user_list.length; index++) {
                if (_.review_user_list[index].review_status === null) {
                  countReview++;
                }
              }
            }
            if (countReview === _.review_user_list.length) isEdit = true;
          }
          return !isEdit;
        },
        onClick: (p) => {
          window._$g.rdr(`/announce/edit/${p?.announce_id}`);
        },
      },

      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SYS_ANNOUNCE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.announce_id),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deleteAnnounce(params);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(items?.map((po) => po?.announce_id)),
        ),
      );
    }
  };
  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={handleBulkAction}
    />
  );
};

export default AnnounceTable;
