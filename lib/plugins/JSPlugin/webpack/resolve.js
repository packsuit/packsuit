const dir = require('./../../../dir');

function merge(dest, src) {
  if (Array.isArray(dest)) {
    return dest.concat(typeof src === 'string' ? [src] : src);
  } else {
    for (let s in src) {
      dest[s] = src[s];
    }
  }

  return dest;
}

module.exports = function resolve(config) {
  let {
    resolve,
    output
  } = output;
  let resolveConfig = {
    alias: {
      'build-config': dir.getDir(output, 'build-config')
    }
  }
  if (resolve) {
    for (let c in resolve) {
      if (resolveConfig[c]) {
        resolveConfig[c] = merge(resolveConfig[c], resolve[c]);
      } else {
        resolveConfig[c] = resolve[c];
      }
    }
  }
  return resolveConfig;
}