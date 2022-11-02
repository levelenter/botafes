module.exports = {
  mode: "development",
  entry: {
    warp: "./src/main/warp.ts",
    warp_ar: "./src/main/warp_ar.ts",
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
