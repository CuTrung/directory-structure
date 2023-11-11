import Page404 from 'pages/PageError/Page404';

const otherPages = [
  {
    path: '/404',
    exact: true,
    name: 'Trang không tồn tại',
    component: Page404,
  },
];
const initRoutes = () => {
  try {
    const routeFiles = require.context('../pages', true, /\.route\.js$/);
    return routeFiles
      .keys()
      .map(routeFiles)
      .map(({ default: routes }) => routes)
      .flat()
      .concat(otherPages);
  } catch (error) {
    console.error('>>> init route error', error);
    return [];
  }
};

export default initRoutes();
