import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../redux/announce.reducer';
import { useNavigate, useOutlet } from 'react-router-dom';

const Announce = () => {
  const outlet = useOutlet();
  const count = useSelector((state) => state.announce.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <h1>Hello parent</h1>
      {outlet}
      <div>
        <div>
          <button aria-label='Increment value' onClick={() => dispatch(increment())}>
            Increment
          </button>
          <span>{count}</span>
          <button aria-label='Decrement value' onClick={() => dispatch(decrement())}>
            Decrement
          </button>
        </div>
        <button type='button' aria-label='Increment value' onClick={() => navigate('/announce/child')}>
          Child
        </button>
      </div>
    </>
  );
};

export default Announce;
