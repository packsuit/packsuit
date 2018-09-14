class Plugin {
  constructor(suit) {
    this.suit = suit;
    this.config = suit.config;
    this.asset = {}
  }
  activate() {

  }
  close() {

  }
  message(message, payload) {
    this.suit.message(message, payload);
  }
}

module.exports = Plugin;