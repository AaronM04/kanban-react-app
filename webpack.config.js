const merge     = require('webpack-merge');
const path      = require('path');
const stylelint = require('stylelint');
const webpack   = require('webpack');
const NpmInstallWebpackPlugin = require('npm-install-webpack-plugin');

stylelint(require('stylelint-config-suitcss'));

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app:   path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries. We'll be using the
  // latter form given that it's convenient with more complex
  // configurations.
  entry: {
    app:      PATHS.app
  },
  output: {
    path:     PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      }
    ],
    postcss: function() {
      return [stylelint({
        rules: {
          'color-hex-case': 'lower'
        }
      })];
    }
  }
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: '127.0.0.1', //process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallWebpackPlugin({
        save: true    // --save
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
