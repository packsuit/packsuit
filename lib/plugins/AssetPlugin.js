const fs = require('../fs');


function PluginAsset(src, dest) {
  return {
    source: function () {
      fs.cp(src, dest);
    }
  }
}

module.exports = PluginAsset;