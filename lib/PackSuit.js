const Suit = require('./Suit');
const AssetPlugin = require('./plugins/AssetPlugin');
const JSPlugin = require('./js');
const path = require('path')
const fs = require('fs');
const {mkdir,existsSync} = require('./fs')
const { parse, generate } = require('./html')
//template改变 html需要重新生成，但是source,filed不需要
//filed改变 html需要重新生成 但是source,template不需要目前不考虑这种情况
//source改变 所有资源都不需要重新生成，只需要reload reload丢给外部插件去做

function Page(template, source, filed, output) {
  return {
    template,//模板
    source,//
    filed,
    output
  }
}
class PackSuit extends Suit {
  constructor(config) {
    super(config);
    this.attach(new JSPlugin(this));
    this.attach(new AssetPlugin(this));
    this._pages = [];
    this._templates = {
    }
    if(!existsSync(config.output)) {
      mkdir(config.output);
    }
  }
  activate(callback) {
    let {pages,output} = this.config;

    pages.forEach(page => {
      //todos:template 要做watch
      let templatePath = page.template ? path.resolve(root, page.template) : path.join(__dirname, './html/template.html');
      if (!this._templates[templatePath]) {
        this._templates[templatePath] = {
          nodes: parse(fs.readFileSync(templatePath).toString()),
          template: templatePath,
          html: [page.output]
        };
      } else {
        this._templates[templatePath].html.push(page.output);
      }
      this._pages.push(Page(templatePath, page.source, page.options, page.output));
    })
    super.activate(() => {
      this._pages.forEach(page => {
        let nodes = this._templates[page.template].nodes;
        page.assets = this.assets;
        let html = generate(nodes, page);
        console.log(path.resolve(output,page.output))
        fs.writeFileSync(path.resolve(output,page.output),html,{encoding:'utf8'});
      })
    })
  }
}


module.exports = PackSuit;