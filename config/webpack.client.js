const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const browserConfig = {
  mode: process.env.NODE_ENV,
  entry: './src/browser/index.browser.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: 'static/',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          publicPath: 'static',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: 'true',
    }),
    // new CompressionPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/template/index.html'),
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new LoadablePlugin(),
    new FaviconsWebpackPlugin({
      logo: path.resolve('src/assets/puzzle.png'),
      // outputPath: 'dist',
      prefix: 'icons',
    }),
    new ManifestPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = browserConfig;
