const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function _(args) {
  return {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader', 
          options: {
            presets: ["@babel/preset-env","@babel/preset-react"]
          }
        },
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.png$/,
        use: { loader: 'url-loader', options: { limit: 100000 } },
      },
      {
        test: /\.jpg$/,
        use: ['file-loader']
      }
    ]
  }
}

module.exports = _;