class Plugin {
  constructor(suit) {
    this.suit = suit;
    this.config = suit.config;
    this.assets = {}
  }
  activate(assets) {

  }
  close() {

  }
  message(message, payload) {
    this.suit.message(message, payload);
  }
}

module.exports = Plugin;