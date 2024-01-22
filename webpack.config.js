const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  entry: "./index.js", // Đường dẫn đến file chính của ứng dụng Express
  target: "node", // Chạy trong môi trường Node.js
  output: {
    path: path.resolve(__dirname, "dist"), // Thư mục chứa file build
    filename: "index.js",
  },
  externals: [nodeExternals()], // Loại bỏ các modules không cần thiết
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
