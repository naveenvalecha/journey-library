const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "debug": false,
                "modules": false,
                "useBuiltIns": false
              }],
              "@babel/preset-react"
            ],

            plugins: [
              "syntax-dynamic-import",
              "@babel/plugin-transform-runtime",
              [ "@babel/plugin-proposal-class-properties", { "loose": true } ],
              "transform-async-to-generator"
            ]
          }
        }
        // query: {
        //   presets: ['@babel/preset-react', '@babel/preset-env'],
        //   plugins: ['@babel/proposal-class-properties']
        // },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    disableHostCheck: true
    // headers: { 
    //   enablePreflight: true,
    //   'Access-Control-Allow-Origin': '*',
    //   "Access-Control-Allow-Credentials": "true",
    //   "access-control-allow-credentials": true,
    //   "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    //   "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Content-Type, Authorization",
    // }
  },
  node: {
    fs: "empty"
 }
};


