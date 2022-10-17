module.exports = {
  mode: "development",
  entry: {
    warp: "./src/main/warp.ts",
    treasure: "./src/main/treasure.ts",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/docs/js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
