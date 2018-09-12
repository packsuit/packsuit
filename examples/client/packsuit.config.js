const path = require('path');

module.exports = function (env) {
  /**
   * react paths
   */
  // var reactjsPaths = [
  //   'node_modules/react/umd/react.development.js',
  //   'node_modules/react-dom/umd/react-dom.development.js'
  // ];
  // var reactminjsPaths = [
  //   'node_modules/react/umd/react.production.min.js',
  //   'node_modules/react-dom/umd/react-dom.production.min.js'
  // ];

  function jsPath(path) {
    return 'js/' + path;
  }
  return {
    /**
     * asset dir ,all file in asset dir will be move to dist dir
     * you can put fonts、images and other static file to the asset dir
     */
    root: path.resolve(__dirname,'./'),
    asset: 'asset',
    output:  path.resolve(__dirname,'../build/client'),
    devtool: 'cheap-module-source-map',
    /**
     * common js, we will just concat it.
     */
    commonFile: {
      /**
       * react js,usually,we don't use webpack to pack the reactjs;
       */
      //react: env == 'dev' ? reactjsPaths : reactminjsPaths,
    },
    entry: {
      index: 'index.js',
      test: 'test.js'
    },
    /**
     * project build config 
     * you can add other property or other release env
     */
    buildConfig: {
      /**
       * default build config 
       */
      defaultConfigs: {
        project: 'client'
      },
      /**
       * different release type will use different config
       */
      dev: {
        ENV: 'dev'
      },
      ft: {
        ENV: 'ft'
      },
      uat: {
        ENV: 'uat'
      },
      prod: {
        ENV: 'prod'
      }
    },
    /**
     * html pages
     */
    pages: [
      {
        //template: 'templates/template.html',
        output: 'index.html',
        source: {
          js: [
            'shim',
            'react',
            'index'
          ]
        },
        options: {
          title: 'client'
        }
      },
      {
        title: 'test',
        //template: 'templates/template.html',
        output: 'test.html',
        source: {
          js: [
            'shim',
            'react',
            'test'
          ]
        },
        options: {
          title: 'test'
        }
      },
    ]
  }
}