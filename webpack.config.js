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
    publicPath: '/js',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: "./public",
    proxy: {
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    inline: true,
    hot: true
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        exclude : '/node_modules',
        loaders : ['babel-loader']
      }
    ]
  }
};

module.exports = config;
