module.exports = {

    watch: true,

    target: 'electron-renderer',

    entry: './app/src/renderer_process.js',

    externals: ['grpc'],

    output: {
        path: __dirname + '/app/build',
        libraryTarget:'commonjs2',
        publicPath: 'build/',
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/, 
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react' 
                    ]
                }
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components)/, 
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader'
                ]
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
}
