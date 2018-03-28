const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: './client/index.js',
  devtool: 'source-map',
  output: {
    filename: 'auth.js',
    path: path.resolve('static'),
    publicPath: '/static/'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.html$/,
      loader: 'file-loader?name=[name].[ext]'
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'file-loader?name=img/[name].[ext]'
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    }, {
      test: /\.js?$/,
      include: /client/,
      loader: 'babel-loader',
      options: {
        presets: [['env', {modules: false}], 'react']
      }
    }]
  }
};
