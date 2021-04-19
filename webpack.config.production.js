var path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  entry: {
    app: [
      'core-js/modules/es6.object.assign',
      'core-js/es6/promise',
      'core-js/es6/map',
      'core-js/es6/set',
      './app/index'
    ]
  },
  resolve: {alias: {}},
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './',
    chunkFilename: '[contenthash].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      //minSize: 30000,
      //maxSize: 0,
      minChunks: 1,
      //maxAsyncRequests: 5,
      //maxInitialRequests: 3,
      //automaticNameDelimiter: '~',
      //name: true,
      /*
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
      */
    },
    minimizer: [
      new UglifyJSPlugin({
      uglifyOptions: {
        sourceMap: false,
        compress: {
        unsafe_comps: true,
        properties: true,
        keep_fargs: false,
        pure_getters: true,
        collapse_vars: true,
        unsafe: true,
        warnings: false,
        //screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        //cascade: true,
        drop_console: true
        }
      }
      }),
    ]
  },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            //"require.specified": "require.resolve"
        }),
        new MiniCssExtractPlugin({allChunks: true, filename: "styles.css", chunkFilename: '[contenthash].css'}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader", options: {babelrc: true}}
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: {minimize: true, sourceMap: false}}
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: {minimize: true, sourceMap: false}},
          {loader: 'postcss-loader'},
          {loader: 'sass-loader'}
        ]
      },
      {
        test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{loader: 'url-loader', options: {limit: 10000}}]
      },
      {
        test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{loader: 'url-loader', options: {limit: 10000, mimetype: "application/octet-stream"}}]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /icon/,
        use: [{loader: 'url-loader', options: {limit: 10000, mimetype: "image/svg+xml"}}]
      },
      {
        test: /\.svg$/,
        use: [{loader: 'svg-inline-loader', options: {removeTags: true}}]
      }
    ]
  }
};
