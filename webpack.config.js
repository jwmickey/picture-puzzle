const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: 'main.js',
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
    new CopyWebpackPlugin([
      {
        from: 'public',
        to: '',
        force: true,
      },
    ]),
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
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'img'
          }
        }
      }
    ]
  }
};
