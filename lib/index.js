
const webpack = require('./webpack');
const path = require('path');
const PROJECT_FILE = 'unite.config.js';
const { sequence } = require('./util');
const html = require('./html');
const fs = require('./fs');
const hooks = [
  'start',
  'close'
];


function js() {

}

function css() {

}

function asset() {

}
function assemebleBuildConfig(data, env, path) {
  let config = data.defaultConfigs || {};
  if (data[env]) {
    Object.assign(config, data[env])
  }
  fs.writeFileSync(path, JSON.stringify(config, null, '\t'))

}
function unite(argv, callback) {
  let {
    env = 'dev',
    config = path.resolve('./', PROJECT_FILE),
  } = argv;
  config = require(config);

  if (typeof config == 'function') {
    config = config(env);
  }
  let {
    entry,
    root,
    output = path.resolve('./', 'build/dest'),
    buildConfig,
    pages
  } = config;
  let buildConfigPath = path.resolve(output, 'buildconfig.json');
  let args = {
    entry,
    env,
    output,
    root,
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
        return js(config);
      },
      function () {
        return css(config);
      },
      function () {
        return asset(config);
      },
      function () {
        return html({
          pages,
          root,
          source: output + '/.asset_cache.json',
          output
        });
      }
    ],
    callback
  );
}
module.exports = unite;