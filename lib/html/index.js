const { generate, parse } = require('./compiler');
const fs = require('fs');
const path = require('path');
const html_beautify = require('js-beautify').html_beautify
module.exports = function html({ source, pages, root, output }) {
    //为什么不直接用require，因为require有缓存机制
    let files = JSON.parse(fs.readFileSync(source).toString());
    //每次都是全部重新生成html，是否可以做缓存判断只生成修改过的html
    pages.forEach(page => {
        let templatePath = page.template ? path.resolve(root, page.template) :path.join(__dirname,'./template.html')
        page.files = files
        let html = generate(parse(fs.readFileSync(templatePath).toString()), page);
        fs.writeFileSync(output+'/'+page.output,html_beautify(html));
    })
}