'use strict'
const fs = require('fs');
const path = require('path');
const {sequence} =  require('./../util');
function rf(src, callback) {
  if (fs.existsSync(src)) {
    let stats = fs.statSync(src);
    callback(src, stats);
    if (stats.isDirectory(src)) {
      fs.readdirSync(src).forEach(function (file) {
        rf(path.join(src, file), callback);
      })
    }
  }
}
function mv(src, dest) {
  rf(src, function (file, stats) {
    let destFile = path.join(dest, path.relative(src, file));
    if (stats.isDirectory()) {
      !exists(destFile) && mkdir(destFile);
    } else {
      if (exists(destFile) && stats.isDirectory()) {
        destFile = path.join(destFile, path.basename(file));
      }
      fs.writeFileSync(destFile, fs.readFileSync(file));
    }
  })
  rm(src);
}
function cp(src, dest) {
  rf(src, function (file, stats) {
    let destFile = path.join(dest, path.relative(src, file));
    if (stats.isDirectory()) {
      !exists(destFile) && mkdir(destFile);
    } else {
      if (exists(destFile) && stats.isDirectory()) {
        destFile = path.join(destFile, path.basename(file));
      }
      fs.writeFileSync(destFile, fs.readFileSync(file));
    }
  })
}
function rm(src) {
  if (fs.existsSync(src)) {
    let stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.readdirSync(src).forEach(function (file) {
        rm(path.join(src, file));
      })
      fs.rmdirSync(src);
    } else {
      fs.unlinkSync(src);
    }
  }
}

function rename(src, dest) {
  fs.renameSync(src, dest);
}
function replace(src, patten, value) {
  if (fs.existsSync(src)) {
    var result = fs.readFileSync(src).toString().replace(patten, value);
    fs.writeFileSync(src, result);
  }
}
function exists(src) {
  return fs.existsSync(src);
}
function mkdir(dir) {
  dir = path.relative('', dir);
  const paths = dir.split(path.sep);
  let current = '';
  for (let i = 0, l = paths.length; i < l; i++) {
    current = path.join(current, paths[i]);
    if (!exists(current)) {
      fs.mkdirSync(current);
    }
  }
}
function upperCaseName(name) {
  return name.replace(/-\w/g, function (c) {
    return c[1].toUpperCase();
  }).replace(/^\w/, function (c) {
    return c.toUpperCase();
  });
}
function pipe(s1,s2) {
  return new Promise((res)=>{
    s1.pipe(s2).end(res);
  })
}
function concat(files,dest,callback) {
  let stream = fs.createWriteStream(dest);
  let queue = [];
  files.forEach(file=>{
    queue.push(()=>{
      return pipe( fs.createReadStream(file),stream)
    })
  });
  sequence(queue,function(){
    stream.end();
    callback && callback();
  })
}
module.exports =  {
  mv,
  rename,
  rm,
  replace,
  mkdir,
  cp,
  upperCaseName,
  rf,
  writeFileSync:fs.writeFileSync,
  existsSync:fs.existsSync,
  concat
};