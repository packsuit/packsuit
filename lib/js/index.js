const UglifyJS = require("uglify-js");
const fs = require('fs');
const path = require('path');

module.exports = function js(root, entry, output, devtool) {
  let entrys = {};
  for (let en in entry) {

    let code = {}

    entry[en].forEach(src => {
      code[src] = fs.readFileSync(path.resolve(root, src), "utf8");

    })
    if (!en.endsWith('.js')) {
      en += '.js';
    }
    en = 'js/' + en;
    let sourceMap = {
      url: `${en}.map`
    }

    let minify = UglifyJS.minify(code, { sourceMap });
    fs.writeFileSync(path.resolve(output, en), minify.code);
    fs.writeFileSync(path.resolve(output, sourceMap.url), minify.map)
  }
}