const path = require('path');

function entry(config) {
  let {
    entry,
    root,
    commonJS
  } = config;
  let entrys = {};
  for (let en in entry) {
    entrys[en] = path.resolve(root, entry[en]);
  }
  // for (let en in commonJS) {
  //   entrys[en] = commonJS[en].map(src=>path.resolve(root, src));
  // }
  return entrys;
}

module.exports = entry;