const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devtool: 'source-map',
  entry: {
    main: path.resolve(__dirname, '../src/script.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'ddrag.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('../src'),
    }
  },
  plugins: [
    new cleanWebpackPlugin(['dist/*'], {
      root: path.resolve(__dirname, '../')
    })
  ],
}