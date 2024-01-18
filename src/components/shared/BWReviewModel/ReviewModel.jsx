
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Alert } from 'antd';


const ReviewModel = ({ open, onClose, title, onConfirm }) => {

    const [reviewNote, setReviewNote] = useState('')
    const [errorMgs, setErrorMgs] = useState('')

    const handleApprove = (value) => {

        if (!reviewNote) {
            setErrorMgs('Ghi chú duyệt là bắt buộc.')
        } else {

            let params = {
                is_reviewed: value,
                review_note: reviewNote
            }
            onConfirm(params)
        }
    };



    return (
        <React.Fragment>
            <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
                <div className='bw_modal_container '>
                    <div className='bw_title_modal'>
                        <h3>{title}</h3>
                        <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>

                    </div>
                    {errorMgs ? (
                        <Alert type={'error'} message={errorMgs} showIcon={false} />
                    ) : null}
                    <div className="bw_main_modal">
                        <div className="bw_frm_box bw_readonly">
                            <label>Ghi chú duyệt</label>
                            <input onChange={({ target: { value } }) => {
                                setReviewNote(value)
                                setErrorMgs('')
                            }}
                                className=""
                                placeholder="Nhập dung ghi chú"></input>
                        </div>
                    </div>
                    <div className='bw_footer_modal'>
                        <button className="bw_btn bw_btn_success" type='button' onClick={() => handleApprove(1)}>
                            <span className="fi fi-rr-check"></span> Duyệt
                        </button>
                        <button className="bw_btn bw_btn_danger" type='button' onClick={() => handleApprove(0)}>
                            <span className="fi fi-rr-cross"></span>
                            Không duyệt
                        </button>
                        <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

ReviewModel.propTypes = {
    open: PropTypes.bool,
    className: PropTypes.string,
    header: PropTypes.node,
    footer: PropTypes.string,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    children: PropTypes.node,

};

export default ReviewModel;
