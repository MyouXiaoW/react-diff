const path = require('path');
const paths = require('./paths');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },

  entry: paths.appIndex,

  output: {
    filename: 'bundle.js',
    path: path.resolve(paths.appPath, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
        // test 符合此正则规则的文件，运用 loader 去进行处理，除了exclude 中指定的内容
      }
    ]
  },

  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin({title: 'react', template: paths.appHTML})]
};
