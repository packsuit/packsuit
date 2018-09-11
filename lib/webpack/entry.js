const path = require('path');

function entry(config) {
  let {
    entry,
    root
  } = config;
  let entrys = {};
  for (let en in entry) {
    entrys[en] = path.resolve(root, entry[en]);
  }
  return entrys;
}

module.exports = entry;