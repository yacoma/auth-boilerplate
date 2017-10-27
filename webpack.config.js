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
  entry: path.resolve('client', 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve('static'),
    publicPath: '/static/',
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
  },
  plugins: plugins
};
