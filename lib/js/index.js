const UglifyJS = require("uglify-js");
const fs = require('fs');
const path = require('path');
const dir = require('./../dir');
const webpack = require('./webpack');
function assemebleBuildConfig(data, env, path) {
  let config = data.defaultConfigs || {};
  if (data[env]) {
    Object.assign(config, data[env])
  }
  fs.writeFileSync(path, JSON.stringify(config, null, '\t'))

}
function js(config, env) {
  let {
    root,
    entry,
    commonJS,
    output,
    resolve,
    buildConfig
  } = config;
  let buildConfigPath = dir.getDir(output, 'build-config');
  assemebleBuildConfig(buildConfig, env, buildConfigPath)
  let args = {
    entry,
    env,
    output,
    root,
    commonJS,
    resolve
  }
  for (let en in commonJS) {
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
    fs.writeFileSync(path.resolve(output, sourceMap.url), minify.map);
  }
  return new Promise(resolve => {
    let webpackComplier = webpack(args);
    webpackComplier.run((err, stats) => {
      resolve();
      console.log(stats.toString({
        colors: true
      }));
    })
  })
}
module.exports = js;