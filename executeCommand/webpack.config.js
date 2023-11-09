const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'commonjs',
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
};