
function generate(nodes, options, assets) {
  return nodes.map(node => {
    return node.render(options, assets);
  }).join('');
}

module.exports = {
  generate
}