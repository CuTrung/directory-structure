const initRoutes = () => {
  try {
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
