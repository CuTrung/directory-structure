import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        components: path.resolve(__dirname, "./src/components/"),
        public: path.resolve(__dirname, "./public/"),
        pages: path.resolve(__dirname, "./src/pages"),
        reduxApp: path.resolve(__dirname, "./src/redux"),
        routers: path.resolve(__dirname, "./src/routers"),
        context: path.resolve(__dirname, "./src/context"),
        utils: path.resolve(__dirname, "./src/utils"),
        services: path.resolve(__dirname, "./src/services"),
        navigation: path.resolve(__dirname, "./src/navigation"),
        hooks: path.resolve(__dirname, "./src/hooks"),
        layouts: path.resolve(__dirname, "./src/layouts"),
      },
    },
    esbuild: {
      loader: "jsx",
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
  });
};
