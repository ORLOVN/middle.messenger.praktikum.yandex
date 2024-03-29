const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chat-app.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
        'express-handlebars': 'handlebars/dist/handlebars.js'
      }

  },
  plugins: [
    new HtmlWebpackPlugin({
    title: 'Chat application',
    template: './src/index.html'
  }),
    new CleanWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
        exclude: /(node_modules)|(\w*\.test\.ts)/g
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ]
  }
};
