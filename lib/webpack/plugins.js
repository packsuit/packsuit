
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackEntrypointsPlugin = require("webpack-entrypoints-plugin");
const dir = require('./../dir')
function plugins(args) {
  let { env } = args;
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
    new WebpackEntrypointsPlugin({path:dir.getDir(args.output,'asset-cache')})
  ]
}

module.exports = plugins;