const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

const browserConfig = {
  mode: process.env.NODE_ENV,
  entry: ['webpack-hot-middleware/client', './src/browser/index.browser.js'],
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
    new webpack.HotModuleReplacementPlugin(),
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
    new ReactLoadablePlugin({
      filename: './dist/react-loadable.json',
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
