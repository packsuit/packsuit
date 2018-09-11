
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackEntrypointsPlugin = require("webpack-entrypoints-plugin");

function plugins(args) {
  let { env } = args;
  return [
    new webpack.DefinePlugin({
      __DEV__: env === 'dev' ? true : false
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    new WebpackEntrypointsPlugin({path:args.output+'/.asset_cache.json'})
  ]
}

module.exports = plugins;