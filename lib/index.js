
const path = require('path');
const PROJECT_FILE = 'unite.config.js';
const fs = require('./fs');
const js = require('./js');
const Complier = require('./complier');
const PackSuit = require('./PackSuit')

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
  const  suit = new PackSuit(config);
  suit.activate();
  return suit;
}
module.exports = packsuit;