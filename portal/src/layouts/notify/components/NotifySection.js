import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import useScroll from 'hooks/use-scroll';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getListNotify } from 'services/global.service';
import { hideNotify } from 'redux/actions/global';
import { LoadingOutlined } from '@ant-design/icons';

const List = styled.div`
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  a,
  h3 {
    line-height: 1;
  }
`;

const LoadingOutlinedStyled = styled(LoadingOutlined)`
  color: var(--blueColor);
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const NotifySection = () => {
  const dispatch = useDispatch();
  const ref = useRef();
  const [data, setData] = useState([]);
  const [isScroll] = useScroll(ref);
  const [stopScroll, setStopScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { typeNotify } = useSelector((state) => state.global);

  const loadNotify = useCallback(() => {
    setLoading(true);
    getListNotify(typeNotify?.apiUrl, page, typeNotify?.value).then((data) => {
      if (data?.items.length === 0) {
        setStopScroll(true);
      } else {
        setData((prev) => _.concat(prev, data?.items));
      }
      setLoading(false);
    });
  }, [typeNotify, page]);
  useEffect(loadNotify, [loadNotify]);

  useEffect(() => {
    if (isScroll && !loading && !stopScroll) {
      setPage((prev) => prev + 1);
    }
  }, [isScroll, loading, stopScroll]);

  return (
    <React.Fragment>
      <List ref={ref}>
        {data.map((o) => (
          <a
            href={typeNotify?.redirectUrl(o?.id, o?.children_id ?? o?.id)}
            onClick={() => {
              dispatch(hideNotify());
            }}
            className={classNames('bw_list_items', {
              bw_non_read: !o?.is_read,
            })}>
            <span className={`fi ${typeNotify?.icon}`}></span>
            <h3>{o?.subject}</h3>
            <span>
              <b>{o?.fullname}</b> - {o?.date}
            </span>
          </a>
        ))}
        {loading && <LoadingOutlinedStyled />}
      </List>
    </React.Fragment>
  );
};

export default NotifySection;
