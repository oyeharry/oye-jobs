'use strict';

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

function getConfig(options) {

  var config = {

    entry: {
      app: './client/index.js',
      vendor: [
        'angular',
        'angular-cookies',
        'angular-resource',
        'angular-sanitize',
        '@uirouter/angularjs',
        'angular-messages',
        'angular-validation-match',
        'angular-material',
        '@flowjs/flow.js'
      ]
    },

    output: {
      path: options.build ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),
      filename: options.build ? '[name].[hash].js' : '[name].bundle.js',
      chunkFilename: options.build ? '[name].[hash].js' : '[name].bundle.js'
    },

    module: {

      rules: [{

          // JS LOADER
          // Reference: https://github.com/babel/babel-loader
          // Transpile .js files using babel-loader
          // Compiles ES6 and ES7 into ES5 code
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              "presets": ["es2015"],
              "plugins": ["angularjs-annotate"]
            }
          },
          include: [
            path.resolve(__dirname, './client/')
          ]
        }, {

          // ASSET LOADER
          // Reference: https://github.com/webpack/file-loader
          // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
          // Rename the file using the asset hash
          // Pass along the updated reference to your code
          // You can add here any file extension you want to get copied to your output
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
          use: 'file-loader'
        }, {

          // HTML LOADER
          // Reference: https://github.com/webpack/raw-loader
          // Allow loading html through js
          test: /\.html$/,
          use: 'raw-loader'
        }, {
          // CSS LOADER
          // Reference: https://github.com/webpack/css-loader
          // Allow loading css through js
          //
          // Reference: https://github.com/postcss/postcss-loader
          // Postprocess your css with PostCSS plugins
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
              use: [
                { loader: 'css-loader', query: { sourceMap: true, minimize: true } },
                { loader: 'postcss-loader' }
              ]
            })
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Extract css files in production builds
            //
            // Reference: https://github.com/webpack/style-loader
            // Use style-loader in development for hot-loading
        }

      ]

    },

    plugins: [

      new CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),

      new HtmlWebpackPlugin({
        template: './client/_index.html',
        filename: 'index.html',
        alwaysWriteToDisk: true
      }),

      new HtmlWebpackHarddiskPlugin({
        outputPath: path.resolve(__dirname, 'client')
      }),

      new ExtractTextPlugin('index.css')
    ],

    cache: true

  };

  // Add build specific plugins
  if (options.build) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        sourceMap: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }),

      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: 'production'
        }
      })
    );
  }

  config.devtool = 'source-map';

  return config;
}

module.exports = {
  get: getConfig
};
