
function generate(nodes, options) {
  return nodes.map(node => {
    return node.parse(options);
  }).join('');
}

module.exports = {
  generate
}