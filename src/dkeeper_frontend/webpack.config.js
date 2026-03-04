const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const canisterEnvVariables = Object.entries(process.env)
    .filter(([key]) => key.startsWith('CANISTER_') || key.startsWith('DFX_'))
    .reduce((acc, [key, value]) => {
      acc[`process.env.${key}`] = JSON.stringify(value);
      return acc;
    }, {});

  return {
    mode: argv.mode || 'development',
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        declarations: path.resolve(__dirname, 'src/declarations'),
      },
      fallback: {
        process: require.resolve('process/browser'),
      },
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, '../../.env'),
        systemvars: true,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist'),
            globOptions: {
              ignore: ['**/favicon.ico', '**/index.html'],
            },
          },
        ],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.DefinePlugin(canisterEnvVariables),
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:4943',
          changeOrigin: true,
        },
      },
    },
  };
};
