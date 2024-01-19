const reducerContext = import.meta.glob('pages/**/*.reducer.js');
const reducers = {};
const modules = Object.entries(reducerContext);
for (const [path, module] of modules) {
  const fileName = path.slice(path.lastIndexOf('/'));
  const nameReducer = fileName.slice(1, fileName.indexOf('.'));
  const reducer = await module().then(({ default: reducer }) => reducer);
  reducers[nameReducer] = reducer;
}
export default reducers;
