

let s = 0;
const STAGE_STATIC = ++s;
const STAGE_JS_START = ++s;
const STAGE_JS = ++s;
const STAGE_JS_END = ++s;
const STAGE_INJECT_START = ++s;
const STAGE_INJECT_HEADER_START = ++s;
const STAGE_INJECT_HEADER = ++s;
const STAGE_INJECT_HEADER_END = ++s;
const STAGE_INJECT_BODY = ++s;
const STAGE_INJECT_TAIL_END = ++s;

const path = require('path');



function tag(src) {
  let ext = path.extname(src);
  switch (ext) {
    case '.js':
      return `<script type="text/javascript" src="${src}"></script>`;
    case '.css':
      return `<link rel="stylesheet" href="${src}">`;
    default:
      return '';
  }
}

const TYPE = {
  STATIC: 'STATIC',//静态文本 不处理
  JS: 'JS',// js片段
  INJECT: 'INJECT',//资源插入片段
}

class Node {
  constructor(type, text) {
    this.type = type;
    this.text = text;
  }
  render() {

  }
}

class StaticNode extends Node {
  constructor(text) {
    super(TYPE.STATIC, text);
  }
  render() {
    return this.text;
  }
}
class InjectNode extends Node {
  constructor(text) {
    super(TYPE.INJECT, text);
    this.name = text;
  }
  render(options, assets) {
    let {
      name
    } = this;
    let source = option.source[name] || [];
    let assets = option.assets;
    return source.map(name => {
      let file = assets[name] || assets[name + '.js'];
      if (!file) {
        return null;
      }
      return file.assets.map(asset => {
        return tag(asset);
      }).join('\r\n');
    }).join('\r\n');
  }
}
class JSNode extends Node {
  constructor(text) {
    super(TYPE.JS, text);

  }
  render(options, assets) {
    return new Function('options', 'return ' + this.text)(options);
  }
}

function injectLikeStr(template, i) {
  return (
    template[i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] === '<!-- inject:'
  );
}
function endInjectLikeStr(template, i) {
  return (
    template[i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] +
    template[++i] === '<!-- endinject -->'
  );
}

function parse(template) {
  let i = 0, l = template.length;
  let stage = STAGE_STATIC;
  let c;
  let nodes = [];
  let text = '';

  while (i < l) {
    c = template[i];
    switch (stage) {
      case STAGE_STATIC:
        if (c === '<') {
          if (template[i + 1] === '!' && injectLikeStr(template, i)) {
            stage = STAGE_INJECT_HEADER_START;
            i += 12;
            break;
            //<!-- inject:[js] -->
          } else if (template[i + 1] === '%' && template[i + 2] === '=') {
            // <%= option.title %>
            i += 3;
            stage = STAGE_JS_START;
            break;
          }
        }
        text += c;
        i++;
        break;
      case STAGE_JS_START:
        if (text) {
          nodes.push(new StaticNode(text));
        }
        text = '';
        stage = STAGE_JS;
      case STAGE_JS:
        if (c === '%' && template[i + 1] === '>') {
          stage = STAGE_JS_END;
          break;
        }
        text += c;
        i++;
        break;
      case STAGE_JS_END:
        if (text) {
          nodes.push(new JSNode(text));
        }
        text = '';
        i += 2;
        stage = STAGE_STATIC;
        break;
      case STAGE_INJECT_HEADER_START:
        if (text) {
          nodes.push(new StaticNode(text));
        }
        text = '';
        stage = STAGE_INJECT_HEADER;
      case STAGE_INJECT_HEADER:
        if (c === '-' && template[i + 1] === '-' && template[i + 2] === '>') {
          stage = STAGE_INJECT_HEADER_END;
        } else {
          text += c;
          i++;
        }
        break;
      case STAGE_INJECT_HEADER_END:
        if (text) {
          nodes.push(new InjectNode(text.trim()));
        }
        text = '';
        stage = STAGE_INJECT_BODY;
      case STAGE_INJECT_BODY:
        if (c === '<' && template[i + 1] === '!' && endInjectLikeStr(template, i)) {
          i += 18;
          stage = STAGE_INJECT_TAIL_END;
          break;
        } else {
          i++;
          break;
        }
      case STAGE_INJECT_TAIL_END:
        stage = STAGE_STATIC;
        break;
    }
  }
  if (text) {
    nodes.push(new StaticNode(text));
  }
  return nodes;

}


module.exports = {
  parse
}