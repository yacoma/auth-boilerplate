const webpack = require('webpack');
const path = require('path');
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }));
  plugins.push(new webpack.LoaderOptionsPlugin({
    options: {
      minimize: true,
      context: __dirname
    }
  }));
}

module.exports = {
  entry: path.resolve('client', 'main.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve('static'),
    publicPath: '/static',
    filename: 'auth.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader"
      ]
    }, {
      test: /\.js?$/,
      include: /client/,
      loader: 'babel-loader',
      options: {
        presets: [['es2015', {modules: false}], 'react']
      }
    }]
  },
  plugins: plugins
};
