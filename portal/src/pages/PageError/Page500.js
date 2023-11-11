import React from 'react';
import _500img from 'assets/502.png';

function Page500(props) {
  return (
    <div className="bw_main_wrapp bw_main_404 bw_flex bw_align_items_center bw_justify_content_center">
      <div className='bw_text_center'>
        <img src={_500img} alt={2} style={{width: '70%'}}/>
        <h2>Bạn không có quyền truy cập</h2>
        <p>Vui lòng liên hệ quản trị viên để được cấp quyền!</p>
      </div>
    </div>
  );
}

export default Page500;
