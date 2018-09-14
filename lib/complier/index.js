const AsyncHook = require('./../hook/AsyncHook')
const Page = require('./Page');
const dir = require('./../dir')
const {parse,generate} = require('./../html')
const hooks = [
  'source',//资源整合
  'page',//准备生成
  'done'//最终生成html文件
];
//template改变 html需要重新生成，但是source,filed不需要
//filed改变 html需要重新生成 但是source,template不需要目前不考虑这种情况
//source改变 所有资源都不需要重新生成，只需要reload reload丢给外部插件去做



class Complier extends AsyncHook {
  constructor(pages, config) {
    this._isWatching = false;
    this._configs = pages;
    this._pages = {};
    this._js = config.js;
    this._css = config.css;
    this._asset = config.asset;
    this._source = [];
    this._templates = {

    }
  }
  watch() {
    this._isWatching = true;
  }
  template() {

  }
  source(callback) {
    this.apply('source', null, callback);
  }
  generateAll(callback) {

  }
  generate(page, callback) {
    let nodes = this._templates[page.template];
  }
  run() {
    if (!this._configs) {
      return;
    }

    this._configs.forEach(page => {
      //todos:template 要做watch
      let templatePath = page.template ? path.resolve(root, page.template) : path.join(__dirname, './template.html');
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
    Promise.resolve([this._js(), this._asset(), this._css()]).then(() => {
      this.apply('source', {}, (source) => {
        this._source = source;
        this._pages.forEach(page => {
          this.apply('page', page, page => {
            let nodes = this._templates[page.template];
            page.files = this._source;
            let html = generate(nodes,page)
          })
        })
      });
    })

  }
}


module.exports = Complier