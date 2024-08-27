const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ModuleFederationPlugin({
        name: 'hostApp',
        remotes: {
          ListingApp: 'listingApp@http://localhost:3001/remoteEntry.js',
          CheckoutApp: 'checkoutApp@http://localhost:3002/remoteEntry.js',
        },
        shared: { react: { singleton: true }, "react-dom": { singleton: true } },
      }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};