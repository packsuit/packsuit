const path = require('path');

const DIRS = {
  'cache': '.cache',
  'build-config': 'buildconfig.json',
  'asset-list': '.asset-list.cache',
}

function getDir(root, name) {
  return path.resolve(root, DIRS[name]);
}

module.exports = { getDir };