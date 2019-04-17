module.exports = {
  watch: true,

  target: 'electron-renderer',

  entry: './app/src/renderer_process.tsx',

  externals: ['grpc'],

  output: {
    path: __dirname + '/app/build',
    libraryTarget: 'commonjs2',
    publicPath: 'build/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ] 
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       parallel: true,
  //     }),
  //   ],
  // }
};
