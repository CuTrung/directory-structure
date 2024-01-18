const routeContext = import.meta.glob('../pages/**/*.route.js');
const routes = [];
const modules = Object.values(routeContext);
for (const module of modules) {
  const route = await module().then(({ default: route }) => route);
  routes.push(route);
}
export default routes.flat();
