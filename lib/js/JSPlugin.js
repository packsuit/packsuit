const Plugin = require('../plugins/Plugin');
const UglifyJS = require("uglify-js");
const fs = require('fs');
const path = require('path');
const dir = require('./../dir');
const webpack = require('./webpack');
const WebpackEntrypointsPlugin = require('webpack-entrypoints-plugin')

function assemebleBuildConfig(data, env, path) {
  let config = data.defaultConfigs || {};
  if (data[env]) {
    Object.assign(config, data[env])
  }
  fs.writeFileSync(path, JSON.stringify(config, null, '\t'))
}


class JSPlugin extends Plugin {
  constructor(suit) {
    super(suit);
    this.webpackComplier;
    this.asset = {}
  }
  activate() {
    let {
      root,
      entry,
      commonJS,
      output,
      resolve,
      buildConfig,
      plugins = [],
      env
    } = this.config;
    let buildConfigPath = dir.getDir(output, 'build-config');
    assemebleBuildConfig(buildConfig, env, buildConfigPath);
    plugins.push(
      new WebpackEntrypointsPlugin({
        change: function (data) {
          this.asset = {
            ...this.asset,
            ...data
          };
        }
      })
    )
    let args = {
      entry,
      env,
      output,
      root,
      commonJS,
      resolve,
      plugins
    }
    for (let en in commonJS) {
      let code = {}
      commonJS[en].forEach(src => {
        code[src] = fs.readFileSync(path.resolve(root, src), "utf8");
      });
      if (!en.endsWith('.js')) {
        en += '.js';
      }
      en = 'js/' + en;
      let sourceMap = {
        url: `${en}.map`
      }

      let minify = UglifyJS.minify(code, { sourceMap });
      fs.writeFileSync(path.resolve(output, en), minify.code);
      fs.writeFileSync(path.resolve(output, sourceMap.url), minify.map);
      this.asset[en] = {
        chunks: [
          en,
        ],
        assets: [
          path.resolve(output, en),
          path.resolve(output, sourceMap.url)
        ]
      }
    }
    return new Promise(resolve => {
      this.webpackComplier = webpack(args);
      this.webpackComplier.run((err, stats) => {
        resolve();
        console.log(stats.toString({
          colors: true
        }));
      })
    })
  }
}

module.exports = JSPlugin