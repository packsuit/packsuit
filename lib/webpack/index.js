const webpack = require('webpack');
const path = require('path');
const entry = require('./entry');
const output = require('./output');
const modules = require('./module');
const plugins = require('./plugins');
const resolve = require('./resolve');

function _config(args) {
  let config = {
    mode: args.env === 'dev' ? 'development' : 'production',
    entry: entry(args),
    output: output(args),
    context: path.resolve(__dirname, './'),
    devtool: args.devtool || 'cheap-module-source-map', //'source-map';
    module: modules(args),
    plugins: plugins(args),
    resolve: resolve(args.resolve),
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  };
  return config;
}

function _(args) {
  return new Promise(function (resolve, reject) {
    if (!entry) {
      resolve();
    } else {
      let config = _config(args);
      let compiler = webpack(config);
      compiler.run(function (err, stats) {
        resolve();
        console.log(stats.toString({
          colors: true
        }));
      });

    }
  })

}

module.exports = _;