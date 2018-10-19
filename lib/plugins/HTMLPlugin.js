const Plugin = require('./Plugin')
const {cp} = require('./../fs')
const path = require('path')
const dir = require('./../dir')
const {parse,generate} = require('./../html')
//template改变 html需要重新生成，但是source,filed不需要
//filed改变 html需要重新生成 但是source,template不需要目前不考虑这种情况
//source改变 所有资源都不需要重新生成，只需要reload reload丢给外部插件去做


function Page(template, asset, filed, output) {
  return {
    template,//模板
    asset,//
    filed,
    output
  }
}
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