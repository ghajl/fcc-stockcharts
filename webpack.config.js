const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const config = {
  entry: ['babel-polyfill','./app/main.js'],
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
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-class-properties']
          }
        }
      },
      {
        test: /\.(s)?css$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`
    })
  ],
};

module.exports = (env, argv) => {
  if (typeof argv === 'undefined') { //mode not defined
    config.entry = [...config.entry, 'webpack-hot-middleware/client'];
    config.mode = 'development';
    config.devtool = 'source-map';
  }
  return config;
}
