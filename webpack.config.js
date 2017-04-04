const path = require('path');
const webpack = require('webpack');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      options: {
        minimize: true,
        debug: false,
        context: __dirname
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: path.resolve('client', 'main.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve('static'),
    publicPath: '/static',
    filename: 'auth.js'
  },
  resolve: {
    modules: [
      path.resolve('client'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
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
