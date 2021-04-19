const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

var config = {
  mode: 'development',
  devtool: "eval-source-map",
  entry: {
    main: [
      'core-js/es6/array',
      'core-js/es6/object',
      'core-js/es6/promise',
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/weak-map',
      'core-js/es6/weak-set',
      //'@ckeditor/ckeditor5-build-classic/build/translations/ru',
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server',
      "react-hot-loader/patch",
      './app/index'
    ]
  },
  output: {
    path: path.join(__dirname, '/public/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      //minSize: 30000,
      //maxSize: 0,
      minChunks: 1
    }
  },
  plugins: [
    new MiniCssExtractPlugin({allChunks: true, filename: "styles.css"}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    //new webpack.DefinePlugin({"require.specified": "require.resolve"})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        //exclude: [/node_modules/, path.resolve(__dirname, "app", "ckeditor")],
        use: {loader: "babel-loader"}
      },
      {
        test: /\.css$/,
        //exclude: /ckeditor/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: {sourceMap: true}}
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          //MiniCssExtractPlugin.loader,
          {loader: 'style-loader'},
          {loader: "css-loader"},//, options: {sourceMap: true}},
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
      }/*,
      {
        test: /\.css$/,
        include: /ckeditor/,
        use: [
                    //{loader: 'style-loader', options: {singleton: true}},
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: {sourceMap: true}},
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    },
                ]
      }*/
    ]
  }
};


module.exports = config;