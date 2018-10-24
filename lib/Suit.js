const { sequence } = require('./util')


class Suit {
  constructor(config) {
    this.messages = {};
    this.plugins = [];
    this.active = false;
    this.config = config;
    this.assets = {};
    this.watching = true;
  }
  activate(callback) {
    if (this.active) {
      return;
    }
    this.activate = true;
    sequence(this.plugins.map((plugin) => {
      return () => {
        return plugin.activate(this.assets);
      }
    }), callback)
  }
  close() {

  }
  watch() {
    if(this.activate) {
      return;
    }
    this.watching = true;
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