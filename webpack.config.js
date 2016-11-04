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
  plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
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
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.js?$/,
      include: /client/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  plugins: plugins
};
