const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const browserConfig = {
  entry: { main: ['./app/main.js']},
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(),  'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(s)?css$/,
        use:  ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};

const serverConfig = {
  entry: ['./server/server.js'],
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(process.cwd(), 'lib/server'),
    filename: 'server.js',
    publicPath: '/lib/server/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new NodemonPlugin({
      script: './lib/server/server.js',
      watch: path.resolve('./server')
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};

module.exports = [browserConfig, serverConfig];
