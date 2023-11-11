import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const setCookie = (key, value, expires = 1) => {
  const minutes = expires * 1440;
  const d = new Date();
  d.setTime(d.getTime() + minutes * 60 * 1000);
  cookie.set(key, value, { path: '/', expires: d });
};

export const removeCookie = (key) => cookie.remove(key, { expires: 1 });

export const getCookie = (key) => cookie.get(key) ?? null;
