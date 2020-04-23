const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './src/index',
  output: {
    chunkFilename: "[name].bundle.js"
  },
  resolve: {
    extensions: [ '.js' ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Picture Puzzle",
      template: "index.html"
    }),
  ],
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: "/(node_modules|bower_components)/",
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    },{
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
    }]
  }
};
