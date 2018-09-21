const Plugin = require('./Plugin')
const {cp} = require('./../fs')
const path = require('path')
class HTMLPlugin extends Plugin{
  activate() {
    let {
      output,
      root,
      asset
    } = this.config;
    //需要生成asset
    let suit = this.suit;

    cp(path.resolve(root, asset), path.resolve(output, asset))
  }
}

module.exports = HTMLPlugin;