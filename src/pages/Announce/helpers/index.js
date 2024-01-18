import { REVIEW_TYPE } from '../utils/constants';

export const optionsSend = [
  {
    label: 'Gửi tất cả',
    value: 1,
    key: 'is_send_to_all',
  },
  {
    label: 'Gửi cho từng phòng bna',
    value: 2,
    key: 'is_send_to_department',
  },
  {
    label: 'Gửi cho từng nhân viên',
    value: 3,
    key: 'is_send_to_user',
  },
];
//Check xem co da duyet chua
export const checkShowButton = (item, idx, arr) => {
  const review_type = [REVIEW_TYPE.ACCEPT, REVIEW_TYPE.REJECT];
  //Neu index = 0, check is_review khac null khong, (null = chua duyet -> is _ reivew = null, hien nut duyet
  //Neu index >=0, is_review  = null,
  //              check is_view cua previous index (index - 1) = null khong
  //                   neu co => an nut duyet
  //                  Neu khong (= 0 hoac = 1) => show nut duyet

  //disabled nut duyet khi isCanReview false (ko phai nguoi duoc phep duyet) va checkReview
  if (item?.is_review >= 0) return false;
  if (idx === 0) return true;
  if (idx > 0) return arr[idx - 1]?.is_review >= 0 ? true : false;
  // let isPending = !review_type.includes(item?.is_review);
  // console.log(isPending, 'ispending');
  // if (isPending) {
  //   if (idx === 0) return true;
  //   console.log(review_type.includes(arr[idx - 1]?.is_review, 'review_type'));
  //   if (idx > 0) return !review_type.includes(arr[idx - 1]?.is_review) ? true : false;
  // }
  // return false;
};
