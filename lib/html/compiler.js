'use strict'

const path = require('path');
const TYPE = {
  STATIC: 'STATIC',//静态文本 不处理
  JS: 'JS',// js片段
  INJECT: 'INJECT',//资源插入片段
}

const STAGE_STATIC = 1;
const STAGE_JS_START = 4;
const STAGE_JS = 5;
const STAGE_JS_END = 6;
const STAGE_INJECT_START = 7;
const STAGE_INJECT_HEADER_START = 8;
const STAGE_INJECT_HEADER = 9;
const STAGE_INJECT_HEADER_END = 10;
const STAGE_INJECT_BODY = 11;
const STAGE_INJECT_TAIL_END = 12;

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

class Node {
  constructor(type, text) {
    this.type = type;
    this.text = text;
  }
  parse() {

  }
}

class StaticNode extends Node {
  constructor(text) {
    super(TYPE.STATIC, text);
  }
  parse() {
    return this.text;
  }
}
class InjectNode extends Node {
  constructor(text) {
    super(TYPE.INJECT, text);
    this.name = text;
  }
  parseHeader(text) {

  }
  parse(option) {
    let {
      name
    } = this;
    let source = option.source[name] || [];
    let files = option.files;
    return source.map(name => {
      let file = files[name] || files[name + '.js'];
      if(!file) {
        return null;
      }
      return file.assets.map(asset=>{
        return tag(asset);
      }).join('\r\n');
    }).join('\r\n');
  }
}
class JSNode extends Node {
  constructor(text) {
    super(TYPE.JS, text);

  }
  parse(option) {
    return new Function('options', 'return ' + this.text)(option.options);
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
function generate(nodes, options) {
  return nodes.map(node => {
    return node.parse(options);
  }).join('');
}
function transform(template, options) {
  generate(parse(template), options);
}

module.exports = {
  parse,
  transform,
  generate
};