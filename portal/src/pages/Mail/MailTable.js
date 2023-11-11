import React, { useState, useCallback, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { upperFirst } from 'lodash';
import { InputNumber } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { deleteForceMail, deleteMail } from './helpers/call-api';
import { useDispatch } from 'react-redux';
import './style.scss';
import { getErrorMessage } from 'utils/index';
import { showConfirmModal } from 'redux/actions/global';
import { useHistory } from 'react-router-dom';

const MailTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleUpdateStatusFlagged,
  checkValueFlagged,
  setDataList,
  typeMail,
  handleChangeRouterView,
  noPaging,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(parseInt(page));

  useEffect(() => {
    setCurrentPage(parseInt(page));
  }, [page]);

  const handleChangePage = useCallback(() => {
    if (parseInt(currentPage) !== parseInt(page)) onChangePage(currentPage);
  }, [currentPage, page]);

  const totalShowRecord = useMemo(() => {
    if (data.length < itemsPerPage) {
      return data.length;
    } else if (itemsPerPage > totalItems) {
      return totalItems;
    } else {
      return itemsPerPage;
    }
  }, [data, itemsPerPage, totalItems]);

  const handleDelete = (value, index) => {
    if (typeMail === 'trash') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa mail vĩnh viễn ?'], () => {
          deleteForceMail(value?.mail_id)
            .then(() => {
              const cloneData = JSON.parse(JSON.stringify(data));
              cloneData.splice(index, 1);
              setDataList((prev) => ({
                ...prev,
                items: cloneData,
                totalItems: prev.totalItems - 1,
              }));
              // lấy lại danh sách email
              onChangePage(currentPage);
            })
            .catch((error) => {
              getErrorMessage(error);
            });
        }),
      );
    } else {
      deleteMail(value?.mail_id)
        .then(() => {
          const cloneData = JSON.parse(JSON.stringify(data));
          cloneData.splice(index, 1);
          setDataList((prev) => ({
            ...prev,
            items: cloneData,
            totalItems: prev.totalItems - 1,
          }));
          // lấy lại danh sách email
          onChangePage(currentPage);
        })
        .catch((error) => {
          getErrorMessage(error);
        });
    }
  };

  if (loading) {
    return (
      <div className='loading_email_custom'>
        <LoadingOutlined />
      </div>
    );
  }

  const replyMail = (id) => {
    let { mail_id } = id;
    localStorage.setItem('isReply', true);
    history.push(`/mail/detail/${mail_id}`);
  };
  const replyAllMail = (id) => {
    let { mail_id } = id;
    localStorage.setItem('isReplyAll', true);
    history.push(`/mail/detail/${mail_id}`);
  };

  return (
    <React.Fragment>
      {data && data.length && data.length > 0 ? (
        data.map((x, i) => {
          let current_time = new Date(x?.senddate).getTime();
          current_time = upperFirst(moment(current_time).fromNow());
          return (
            <div className={`bw_list_email ${x?.is_read ? null : 'bw_non_read'}`} key={i}>
              <Tooltip title={`${x?.is_flagged ? 'Có đánh dấu sao' : 'Không đánh dấu sao'}`} placement='bottom'>
                <span
                  className={`bw_start_email ${x?.is_flagged ? 'bw_active' : null}`}
                  onClick={() => checkValueFlagged(handleUpdateStatusFlagged, x, i)}
                />
              </Tooltip>
              <div className='bw_us_email' onClick={() => handleChangeRouterView(x)}>
                <img alt='' src={x?.default_picture} />
                <h3>{x?.full_name}</h3>
              </div>
              <p onClick={() => handleChangeRouterView(x)}>{x?.mail_subject}</p>
              <span className='bw_time_email'>{current_time}</span>
              <div className='bw_active_items'>
                <Tooltip title={`Trả lời tất cả`} placement='bottom'>
                  <span onClick={() => replyAllMail(x)}>
                    <i className='fi fi-rr-reply-all' />
                  </span>
                </Tooltip>

                {typeMail === 'trash' ? null : (
                  <Tooltip title={`Trả lời`} placement='bottom'>
                    <span onClick={() => replyMail(x)}>
                      <i className='fi fi-rr-edit' />
                    </span>
                  </Tooltip>
                )}

                <Tooltip title={`Chuyển vào thùng rác`} placement='bottom'>
                  <span onClick={() => handleDelete(x, i)}>
                    <i className='fi fi-rr-trash' />
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        })
      ) : (
        <div className='no_email_custom'>Không có thư</div>
      )}

      <div className='bw_row bw_mt_2 bw_show_table_page'>
        <div className='bw_col_6'>
          <p>
            Show {totalShowRecord}/{totalItems} records
          </p>
        </div>
        <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
          <div className='bw_nav_table'>
            <button
              disabled={!(currentPage !== 1)}
              onClick={() => {
                onChangePage(parseInt(currentPage) - 1);
              }}
              className={currentPage !== 1 ? 'bw_active' : ''}>
              <span className='fi fi-rr-angle-small-left'></span>
            </button>
            <InputNumber
              min={1}
              style={{
                marginRight: '6px',
              }}
              onChange={(e) => {
                setCurrentPage(e);
              }}
              onPressEnter={() => onChangePage(currentPage)}
              onBlur={() => handleChangePage()}
              value={currentPage}
              max={totalPages}
            />
            <span className='bw_all_page'>/ {totalPages}</span>
            <button
              disabled={parseInt(totalPages) === parseInt(currentPage)}
              onClick={() => {
                onChangePage(parseInt(currentPage) + 1);
              }}
              className={!(parseInt(totalPages) === parseInt(currentPage)) ? 'bw_active' : ''}>
              <span className='fi fi-rr-angle-small-right'></span>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MailTable;
