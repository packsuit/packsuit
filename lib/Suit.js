const { sequence } = require('./util')


class Suit {
  constructor(config) {
    this.messages = {};
    this.plugins = [];
    this.active = false;
    this.config = config;
    this.assets = {};
  }
  activate(callback) {
    if (this.active) {
      return;
    }
    sequence(this.plugins.map((plugin) => {
      return () => {
        return plugin.activate(this.assets);
      }
    }), callback)
  }
  close() {

  }
  watch() {

  }
  attach(plugin) {
    this.plugins.push(plugin);
  }
  publish(name, callback) {
    this.messages[name] = callback;
  }
  message(name, payload) {
    this.messages[name](payload)
  }
}

module.exports = Suit;