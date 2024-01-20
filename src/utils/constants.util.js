import { convertToListOptions } from './helpers.util';

export const COOKIE_JWT = 'token';

export const STATUS_OPTIONS = convertToListOptions([{ all: 2 }, { active: 1 }, { hidden: 0 }]);

export const REVIEW_STATUS_OPTIONS = convertToListOptions([
  { all: 3 },
  { accepted: 1 },
  { reviewing: 2 },
  { rejected: 0 },
]);

export const GENDER_OPTIONS = convertToListOptions([{ all: 2 }, { male: 1 }, { female: 0 }]);

export const DEFAULT_PAGING = {
  items: [],
  itemsPerPage: 0,
  page: 0,
  totalItems: 0,
  totalPages: 0,
};
