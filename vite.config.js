/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(globalThis, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    plugins: [react()],
    server: {
      port: globalThis.VITE_PORT || 3000,
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, './src/components/'),
        public: path.resolve(__dirname, './public/'),
        pages: path.resolve(__dirname, './src/pages'),
        reduxApp: path.resolve(__dirname, './src/reduxApp'),
        routers: path.resolve(__dirname, './src/routers'),
        context: path.resolve(__dirname, './src/context'),
        utils: path.resolve(__dirname, './src/utils'),
        services: path.resolve(__dirname, './src/services'),
        navigation: path.resolve(__dirname, './src/navigation'),
        hooks: path.resolve(__dirname, './src/hooks'),
        layouts: path.resolve(__dirname, './src/layouts'),
        configs: path.resolve(__dirname, './src/configs'),
      },
    },
    esbuild: {
      loader: 'jsx',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
  });
};
