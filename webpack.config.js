const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  entry: {
    index: './src/index.js'
  },
  output: {
    chunkFilename: '[name].bundle.js'
  },
  devServer: {
    stats: 'errors-only',
    overlay: true,
    host: '0.0.0.0',
    port: 3000,
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Picture Puzzle',
      template: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: '/(node_modules|bower_components)/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  }
};
