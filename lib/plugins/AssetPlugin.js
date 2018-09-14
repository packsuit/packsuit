const Plugin = require('./Plugin')
const {cp} = require('./../fs')
class AssetPlugin extends Plugin{
  activate() {
    let {
      output,
      root,
      asset
    } = this.config;
    //需要生成asset
    cp(path.resolve(root, asset), path.resolve(output, asset))
  }
}

module.exports = AssetPlugin;