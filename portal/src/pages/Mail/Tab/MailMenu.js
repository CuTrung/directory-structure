/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTypeMail } from '../actions';
import inboxImage from 'assets/bw_image/icon/i__inbox.svg';
import emailImage from 'assets/bw_image/icon/i__email.svg';
import emailStarImage from 'assets/bw_image/icon/i__email_star.svg';
import trashImage from 'assets/bw_image/icon/i__trash.svg';

const MailMenu = () => {
  const dispatch = useDispatch();

  const countNotRead = useSelector((state) => state.mailbox.countNotRead);
  const typeMail = useSelector((state) => state.mailbox.typeMail);

  const history = useHistory();
  const [type, setType] = useState(null);

  const handleCreateCompose = () => {
    history.push(`/mail/compose`);
  };

  const handleChangeRouter = ({ typeMail }) => {
    localStorage.setItem('typeMail', typeMail);
    dispatch(setTypeMail(typeMail));
    if (typeMail === 'inbox') {
      history.push(`/mail`);
    } else {
      history.push(`/mail/${typeMail}`);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('typeMail') && typeMail) {
      if (localStorage.getItem('typeMail') == typeMail) {
        setType(typeMail);
      } else {
        setType(localStorage.getItem('typeMail'));
      }
    }
  }, [localStorage.getItem('typeMail'), typeMail]);
  // localStorage.getItem('type')

  return (
    <div className='bw_col_3 bw_left_mail'>
      <span className='bw_btn bw_btn_success bw_send_mail' onClick={() => handleCreateCompose()}>
        <span className='fi fi-rr-envelope-plus'></span>
        <p className='bw_btn_text_mail'>Soạn thư</p>
      </span>
      <ul className='bw_control_form bw_action_email'>
        <li onClick={() => handleChangeRouter({ typeMail: 'inbox' })}>
          <a className={type === 'inbox' ? 'bw_active' : ''}>
            <img src={inboxImage} /> Hộp thư đến
            {countNotRead > 0 && <span>{countNotRead}</span>}
          </a>
        </li>
        <li onClick={() => handleChangeRouter({ typeMail: 'send' })}>
          <a className={type == 'send' ? 'bw_active' : ''}>
            <img src={emailImage} /> Hộp thư đi
          </a>
        </li>
        <li onClick={() => handleChangeRouter({ typeMail: 'flagged' })}>
          <a className={type == 'flagged' ? 'bw_active' : ''}>
            <img src={emailStarImage} /> Thư đánh dấu
          </a>
        </li>
        <li onClick={() => handleChangeRouter({ typeMail: 'draft' })}>
          <a className={type == 'draft' ? 'bw_active' : ''}>
            <img src={emailImage} /> Thư nháp
          </a>
        </li>
        <li onClick={() => handleChangeRouter({ typeMail: 'trash' })}>
          <a className={type == 'trash' ? 'bw_active' : ''}>
            <img src={trashImage} /> Thùng rác
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MailMenu;
