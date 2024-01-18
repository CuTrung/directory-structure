import Page404 from "pages/PageError/Page404";

const otherPages = [
  {
    path: "/404",
    exact: true,
    name: "Trang không tồn tại",
    component: Page404,
  },
];
const initRoutes = () => {
  try {
    // const routeFiles = import.meta.glob("../pages/**/*.route.js");
    // return routeFiles
    //   .keys()
    //   .map(routeFiles)
    //   .map(({ default: routes }) => routes)
    //   .flat()
    //   .concat(otherPages);

    const routeContext = import.meta.glob("../pages/**/*.route.js");
    const routes = Object.keys(routeContext)
      .map((key) => {
        const match = key.match(/\.\/(.+)\/(.+)\.route\.js$/);
        if (match) {
          const [, folder, fileName] = match;
          return {
            path: `/${folder}/${fileName}`,
            component: () => import(`../pages/${folder}/${fileName}.route.js`),
          };
        }
        return null;
      })
      .filter(Boolean);
    return routes;
  } catch (error) {
    console.error(">>> init route error", error);
    return [];
  }
};

export default initRoutes();
