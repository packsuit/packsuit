function sequence(list, callback) {
  if (list.length == 0) {
    return callback && callback();
  }
  let task = list.shift()();
  if (typeof task === 'object' && typeof task.then === 'function') {
    task.then(function () {
      sequence(list, callback)
    });
  } else {
    sequence(list, callback)
  }
}

module.exports = {
  sequence
}