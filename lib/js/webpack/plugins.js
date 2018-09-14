
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
function plugins(args) {
  let { env,plugins = [] } = args;
  return [
    new webpack.DefinePlugin({
      __DEV__: env === 'dev' ? true : false
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].css"
    }),
    ...plugins
  ]
}

module.exports = plugins;