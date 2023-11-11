import pathToRegexp from 'path-to-regexp';

export const getErrorMessage = (error, msg = 'Đã có lỗi xảy ra') => {
  if (typeof error === 'string') return error;

  if (error instanceof Array) {
    const objErr = {};
    for (const err of error) {
      objErr[err.key] = err.msg;
    }
    return JSON.stringify(objErr);
  }
  if (typeof error !== 'object') return msg;
  return error.message ?? error.errmsg ?? msg;
};

export const formatter = (data, parentPath = '', parentAuthority) =>
  data.map((item) => {
    const result = {
      ...item,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority);
      result.children = children;
    }
    delete result.routes;
    return result;
  });

export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb ?? {};
};

export function urlToList(url) {
  const urlList = url.split('/').filter((i) => i);
  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`);
}
