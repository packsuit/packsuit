const path = require('path');

function output(args) {
  let output = {
    filename: 'js/[name].[chunkhash].js',
    publicPath: "",
    chunkFilename:'js/[name].[chunkhash].js', 
    path: args.output
  };
  return output;
}
module.exports = output;