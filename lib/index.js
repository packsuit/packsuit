
const webpack = require('./webpack');
const path = require('path');
const PROJECT_FILE = 'unite.config.js';
const { sequence } = require('./util');
const html = require('./html');
const fs = require('./fs');
const js = require('./js');
const dir = require('./dir');
const hooks = [
  'start',
  'close'
];



function css() {

}

function moveAsset(src,dest) {
  fs.cp(src,dest);
}
function assemebleBuildConfig(data, env, path) {
  let config = data.defaultConfigs || {};
  if (data[env]) {
    Object.assign(config, data[env])
  }
  fs.writeFileSync(path, JSON.stringify(config, null, '\t'))

}
function packsuit(config, env = 'dev', callback) {
  let watched = false;
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
    pages
  } = config;
  let buildConfigPath = dir.getDir(output, 'build-config');
  let args = {
    entry,
    env,
    output,
    root,
    commonJS,
    resolve: {
      alias: {
        'build-config': buildConfigPath
      }
    }
  }
  if (!fs.existsSync(output)) {
    fs.mkdir(output)
  }
  sequence(
    [
      function () {
        return assemebleBuildConfig(buildConfig, env, buildConfigPath)
      },
      function () {
        return webpack(args);
      },
      function () {
        return js(root,commonJS,output);
      },
      function () {
        return css(config);
      },
      function () {
        if(asset){
          return moveAsset(path.resolve(root,asset),path.resolve(output,asset));
        }
      },
      function () {
        return html({
          pages,
          root,
          source: dir.getDir(output,'asset-cache'),
          output
        });
      }
    ],
    callback
  );
  return {
    watch: function watch(config, callback) {
      watched = true;
    }
  }
}
module.exports = packsuit;