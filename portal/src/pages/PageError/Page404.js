import React from 'react';
import _404img from 'assets/404.png';

function Page404() {
  return (
  <div className="bw_main_wrapp bw_main_404 bw_flex bw_align_items_center bw_justify_content_center">
    <div className="bw_text_center">
      <img src={_404img} alt={2} />
      <h2>Trang không tìm thấy</h2>
      <p>Vui lòng kiểm tra lại đường dẫn của bạn!</p>
    </div>
  </div>

  );
}

export default Page404;
