const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const config = {
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [{
                    test: /\.css(\?|$)/,
                    use: ExtractTextPlugin.extract({
                        use: isDevBuild ? 'css-loader' : 'css-loader?minimize'
                    })
                },
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
                    use: 'url-loader?limit=100000'
                }
            ]
        },
        entry: {
            vendor: [
                // 'bootstrap',
                // 'bootstrap/dist/css/bootstrap.css',
                'history',
                'react',
                'react-dom',
                'react-router-dom',
                'react-redux',
                'redux',
                'redux-thunk',
                'react-router-redux',
                // 'jquery'
            ],
        },
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            // new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
            new webpack.DllPlugin({
                path: path.join(__dirname, 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [
            new ExtractTextPlugin('[name].css'),
        ] : [
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new webpack.optimize.UglifyJsPlugin()
        ]),
        stats: {
            modules: false
        },
    };
    return config;
};