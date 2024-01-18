import React, { useRef, useEffect, useCallback, useState } from 'react';
import { getListAnnounceNotRead, getListAnnounceViewLazyLoad } from './helpers/call-api';
import _ from 'lodash';

import AnnounceViewFilter from './AnnounceViewFilter';
import AnnounceViewTable from './AnnounceViewTable';
import { useDispatch, useSelector } from 'react-redux';
import { setCountNotRead } from './actions/index';
import ModalAnnounceView from './components/ModalAnnounceView';
import useScroll from 'hooks/use-scroll';
import { useHistory, useParams } from 'react-router-dom';
import { getErrorMessage } from 'utils/index';
import { defaultParams } from 'utils/helpers';

const AnnounceViewList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { id: announceId } = useParams();
  const [currentAnnounceId, setCurrentAnnounceId] = useState();
  const [params, setParams] = useState(defaultParams);
  const announceViewListRef = useRef(null);
  const [data, setData] = useState([]);
  const [isScroll] = useScroll(announceViewListRef);
  const [stopScroll, setStopScroll] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotify = useCallback(() => {
    setLoading(true);
    getListAnnounceViewLazyLoad(params).then((data) => {
      if (!currentAnnounceId) {
        setCurrentAnnounceId(data.items[0]?.announce_id);
      }
      if (data?.items.length === 0) {
        setStopScroll(true);
        setLoading(false);
        return;
      }
      if (params.page > 1) {
        setData((prev) => _.concat(prev, data?.items));
      } else {
        setData(data?.items);
      }

      setLoading(false);
    });
  }, [params]);
  useEffect(loadNotify, [loadNotify]);

  useEffect(() => {
    if (isScroll && !loading && !stopScroll) {
      setParams((prev) => {
        return {
          ...prev,
          page: prev.page + 1,
        };
      });
    }
  }, [isScroll, loading, stopScroll]);
  const getCountNotRead = useCallback(() => {
    getListAnnounceNotRead().then((value) => {
      dispatch(setCountNotRead(value));
    });
  }, []);

  useEffect(() => {
    getCountNotRead();
  }, [getCountNotRead]);

  let countNotRead = useSelector((state) => state.announce.countNotRead);

  const handleChangeAnnounceView = async (value) => {
    try {
      history.push(`/notification/detail/${value.announce_id}`);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleChangeRouter = () => {
    try {
      if (!announceId && data && data.length > 0) history.push(`/notification/detail/${currentAnnounceId}`);
    } catch (error) {
      getErrorMessage(error);
    }
  };
  useEffect(() => {
    handleChangeRouter();
  }, [handleChangeRouter]);

  return (
    <div className='bw_main_wrapp bw_no_padding_b'>
      <div className='bw_card_items '>
        <div className='bw_flex bw_justify_content_between bw_search_border'>
          <h3 className='bw_title_card'>Thông báo ({countNotRead})</h3>
          <AnnounceViewFilter
            onChange={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                  page: 1,
                };
              });
            }}
          />
        </div>

        <div className='bw_flex bw_justify_content_between bw_main_notice'>
          <div className='bw_list_notice_de' ref={announceViewListRef}>
            {(data ?? []).map((announce) => {
              return (
                <ModalAnnounceView
                  announce={announce}
                  announceId={announceId}
                  handleChangeAnnounceView={handleChangeAnnounceView}
                />
              );
            })}
          </div>
          {data && data.length && <AnnounceViewTable announce_id={announceId} />}
        </div>
      </div>
    </div>
  );
};

export default AnnounceViewList;
