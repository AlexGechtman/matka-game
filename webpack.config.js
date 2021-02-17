const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map', // Intended for development
 // devtool: 'source-map',    // Intended for production 
  entry: './src/index.ts',
  output: {
    publicPath: 'public',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      },
    ]
  }
};





