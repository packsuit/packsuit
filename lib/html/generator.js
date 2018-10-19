
function generate(nodes, options) {
  return nodes.map(node => {
    return node.render(options);
  }).join('');
}

module.exports = {
  generate
}