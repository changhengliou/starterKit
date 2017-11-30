const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const bundleOutputDir = './dist';
    const bundleInputDir = './app/app.js';

    const config = {
        resolve: {
            extensions: ['.js', '.jsx']
        },
        devServer: {
            contentBase: path.join(__dirname),
            compress: true,
            host: "0.0.0.0",
            // https: true,
            index: 'index.html',            
            port: 3000
        },
        entry: {
            'client': path.join(__dirname, bundleInputDir)
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        module: {
            rules: [{
                    test: /\.js(x?)$/,
                    include: /app/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: isDevBuild,
                            babelrc: false,
                            presets: [
                                ['env', {
                                    targets: {
                                        "browsers": ["last 2 versions", "ie >= 7"]
                                    },
                                    modules: false,
                                    useBuiltIns: false,
                                    debug: false,
                                }],
                                "react", "stage-0"
                            ],
                            plugins: ["transform-runtime", "transform-react-constant-elements", "transform-react-inline-elements"]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader',
                            options: {
                                module: false,
                                minimize: isDevBuild ? false : true,
                                localIdentName: '_[name]__[local]_[hash:base64:5]'
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        }]
                    })
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: 'url-loader?limit=50000'
                }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            new ExtractTextPlugin('[name].css'),            
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            new ExtractTextPlugin('[name].[chunkhash].css'),            
            new webpack.optimize.UglifyJsPlugin()
        ]),
        stats: {
            modules: false
        }
    };

    return config;
};