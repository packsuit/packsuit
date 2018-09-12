const UglifyJS = require("uglify-js");
const fs = require('fs');
const path = require('path');

module.exports = function js(context, entry, output, devtool) {
  let entrys = {};
  for (let en in entry) {

    let code = {}

    entry[en].forEach(src => {
      code[src] = fs.readFileSync(path.resolve(context, src), "utf8");

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