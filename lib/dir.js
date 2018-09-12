const path = require('path');

const DIRS = {
  'cache': '.cache',
  'build-config': 'buildconfig.json',
  'asset-cache': '.asset_cache.json',
}

function getDir(root, name) {
  return path.resolve(root, DIRS[name]);
}

module.exports = { getDir };