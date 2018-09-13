
const webpack = require('./webpack');
const path = require('path');
const PROJECT_FILE = 'unite.config.js';
const { sequence } = require('./util');
const { generate, parse } = require('./html');
const fs = require('./fs');
const JSPlugin = require('./plugins/JSPlugin');
const AssetPlugin = require('./plugins/AssetPlugin');
const dir = require('./dir');
const Complier = require('./complier');



function css() {

}

function moveAsset(src, dest) {
  fs.cp(src, dest);
}
function assemebleBuildConfig(data, env, path) {
  let config = data.defaultConfigs || {};
  if (data[env]) {
    Object.assign(config, data[env])
  }
  fs.writeFileSync(path, JSON.stringify(config, null, '\t'))

}
function packsuit(config, env = 'dev', callback) {
  if (!config) {
    return;
  }
  if (typeof config == 'function') {
    config = config(env);
  }
  let {
    entry,
    commonJS,
    root,
    asset,
    output = path.resolve('./', 'build/dest'),
    buildConfig,
    pages,
    resolve
  } = config;
  let complier = new Complier(pages);
  //处理js
  complier.plugin(JSPlugin({
    root,
    output,
    entry,
    commonJS,
    buildConfig,
    resolve
  }))
  complier.plugin(AssetPlugin(path.resolve(root, asset), path.resolve(output, asset)))

  if (!fs.existsSync(output)) {
    fs.mkdir(output)
  }
  complier.run();
  return complier;
}
module.exports = packsuit;