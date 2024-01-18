export const REVIEW_TYPE = {
  PENDING: null,
  ACCEPT: 1,
  REJECT: 0,
};

export const REVIEW_STATUS_TYPES = {
  NOREVIEW: 0,
  REVIEWED: 1,
  NOTYETREVIEW: 2,
  REVIEWING: 3,
  ALL: 4,
};
export const TYPE_REVIEW = {
  PENDING: -1,
  ACCEPT: 1,
  REJECT: 0,
};
export const reviewTypeOptions = [
  {
    label: 'Chưa duyệt',
    colorLabel: 'bw_black',
    className: '',
    icon: 'fi-rr-minus',
    value: TYPE_REVIEW.PENDING,
  },
  {
    label: 'Đã duyệt',
    colorLabel: 'bw_green',
    className: 'bw_agree',
    icon: 'fi-rr-check',
    value: TYPE_REVIEW.ACCEPT,
  },
  {
    label: 'Không duyệt',
    colorLabel: 'bw_red',
    className: 'bw_non_agree',
    icon: 'fi-rr-minus',
    value: TYPE_REVIEW.REJECT,
  },
];

export const reviewStatusOption = [
  {
    label: 'Tất cả',
    value: REVIEW_STATUS_TYPES.ALL,
  },
  {
    label: 'Đã duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWED,
  },
  {
    label: 'Chưa duyệt',
    value: REVIEW_STATUS_TYPES.NOTYETREVIEW,
  },
  {
    label: 'Đang duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWING,
  },
  {
    label: 'Không duyệt',
    value: REVIEW_STATUS_TYPES.NOREVIEW,
  },
];
