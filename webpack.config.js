const path = require("path");
const nodeExternals = require("webpack-node-externals");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// const entry = glob.sync("./app/**/*.js", {
//   ignore: "./app/modules/**/*.js",
// });
module.exports = {
  mode: "production",
  entry: "./index.js", // Đường dẫn đến file chính của ứng dụng Express
  target: "node", // Chạy trong môi trường Node.js
  output: {
    path: path.resolve(__dirname, "build"), // Thư mục chứa file build
    filename: "index.js",
  },
  externals: [nodeExternals()], // Loại bỏ các modules không cần thiết
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "app/modules", to: "modules" }, // Đường dẫn thư mục cần giữ nguyên cấu trúc
      ],
    }),
  ],
};
