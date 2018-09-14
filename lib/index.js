
const path = require('path');
const PROJECT_FILE = 'unite.config.js';
const fs = require('./fs');
const js = require('./js');
const Complier = require('./complier');
const Suit = require('./Suit')

function moveAsset(src, dest) {
  fs.cp(src, dest);
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
  let complier = new Complier(pages, {
    js: function (change) {
      return js({
        root,
        output,
        entry,
        commonJS,
        buildConfig,
        resolve
      }, env, change)
    },
    asset: function (change) {
      moveAsset(path.resolve(root, asset), path.resolve(output, asset))
      return Promise.resolve();
    },
    css: function (change) {
      return Promise.resolve();
    }

  });
  if (!fs.existsSync(output)) {
    fs.mkdir(output)
  }
  complier.run();
  return complier;
}
module.exports = packsuit;