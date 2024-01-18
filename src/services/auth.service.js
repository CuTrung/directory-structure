import httpClient from 'utils/httpClient.js';

const getOptionsRecursive = (input, opts, output) => {
  output = output instanceof Array ? output : [];
  opts = Object.assign(
    {
      level: 0,
      prefix: ' |--- ',
      idProp: 'menu_id',
      pidProp: 'parent_id',
      nameProp: 'menu_name',
      sortProp: 'order_index',
    },
    opts,
  );

  opts.level++;

  let parentId = opts.parentId;
  parentId = parentId === null || parentId === undefined ? '0' : '' + parentId;

  opts.merge =
    opts.merge ||
    function ({ item, output, opts /*, input*/ }) {
      output.push(item);
    };

  // Sort?
  if (opts.level === 1 && input.length) {
    input.sort(function (a, b) {
      let aIdx = 1 * a[opts.sortProp];
      let bIdx = 1 * b[opts.sortProp];
      return !isNaN(aIdx) && isNaN(bIdx) ? aIdx > bIdx : 0;
    });
  }

  (input || []).forEach((item) => {
    item = Object.assign({}, item);
    if (opts.pidProp in item && '' + item[opts.pidProp] === parentId) {
      if (opts.nameProp in item) {
        item[opts.nameProp] = new Array(opts.level).join(opts.prefix) + item[opts.nameProp];
      }
      opts.merge({ item, output, opts, input });
      let id = item.id || item[opts.idProp];
      if (id) {
        Object.assign(opts, { parentId: id });
        getOptionsRecursive(input, opts, output);
      }
    }
  });

  return output;
};

export const login = (value) => httpClient.post('auth/token', { ...value, platform: 'portal' });

export const getProfile = () => httpClient.get('auth/get-profile');

export const getFunctions = () => httpClient.get('function/functions-by-user-group');

const getMenuByUser = (params = {}) => httpClient.get('menu/get-by-user', { params });

export const getNavigation = () => {
  const opts = {
    prefix: '',
    merge: function ({ item, output, opts }) {
      output.push(Object.assign(item, { _: { level: opts.level } }));
    },
  };
  const httpClientOpts = Object.assign({}, opts['_httpClient']);
  delete opts['_httpClient'];

  return getMenuByUser(httpClientOpts).then((data) => getOptionsRecursive(data || [], opts));
};
