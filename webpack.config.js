var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/js');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: [
    APP_DIR + '/App.jsx'
  ],
  output: {
    path: BUILD_DIR,
    publicPath: '/public',
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loaders : ['babel-loader']
      }
    ]
  }
};

module.exports = config;
