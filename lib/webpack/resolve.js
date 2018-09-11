
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

module.exports = function resolve(resolveConfig) {
  let config = {

  }
  if (resolveConfig) {
    for (let c in resolveConfig) {
      if (config[c]) {
        config[c] = merge(config[c], resolveConfig[c]);
      } else {
        config[c] = resolveConfig[c];
      }
    }
  }
  return config;
}