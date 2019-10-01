const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const CompressionPlugin = require('compression-webpack-plugin');

const serverConfig = {
  mode: process.env.NODE_ENV,
  entry: './src/server/index.server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, '..'),
    filename: 'server.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
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
        use: [
          {
            loader: 'css-loader',
            options: {
              onlyLocals: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          emitFile: false,
          publicPath: 'static',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'false',
    }),
    // new CompressionPlugin(),
  ],
};

module.exports = serverConfig;
