const Suit = require('./Suit');
const AssetPlugin = require('./plugins/AssetPlugin');
const JSPlugin = require('./js');
class PackSuit extends Suit{
  constructor() {
    this.attach(new JSPlugin(this));
    this.attach(new AssetPlugin(this))
  }

}


module.exports = PackSuit;