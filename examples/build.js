const packsuit = require('./../index');

function build(path) {
  packsuit(require('./' + path + '/packsuit.config.js'), 'dev');
}

module.exports = build;