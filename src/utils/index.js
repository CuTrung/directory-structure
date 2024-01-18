
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

export function urlToList(url) {
  const urlList = url.split('/').filter((i) => i);
  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`);
}
