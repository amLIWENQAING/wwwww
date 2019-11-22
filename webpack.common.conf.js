const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const chalk = require('chalk');
const webpack = require('webpack');
let resolve = subPath => { return path.resolve(__dirname, subPath || '') }

module.exports = {
    entry: ['./src/index.js', '@babel/polyfill'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.[hash].js',
        chunkFilename: 'js/[name].bundle.[hash].js',
        publicPath: '/',
    },
    // resolve: {
    //     extensions: ['.jsx','.js', '.vue', '.json'],
    //     modules: [resolve('node_modules')],
    //     alias: {
    //       '@': resolve('./src'),
    //       'component': resolve('./src/container/webRtcLive/component'),
    //       'layout': resolve('./src/container/webRtcLive/component/layout'),
    //       'module': resolve('./src/container/webRtcLive/module'),
    //       'pages': resolve('./src/container/webRtcLive/pages'),
    //       'util': resolve('./src/container/webRtcLive/util'),
    //       'assets': resolve('./src/container/webRtcLive/assets'),
    //     //   'images': resolve('./src/container/webRtcLive/images'),
    //       'store': resolve('./src/container/webRtcLive/store'),
    //       'ext': resolve('./src/container/webRtcLive/ext'),
    //     //   'config': resolve('./src/container/webRtcLive/config')
    //     }
    // },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            "@babel/plugin-syntax-dynamic-import",
                            ["import", {
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": "css" // `style: true` 会加载 less 文件
                            }],
                            "@babel/plugin-transform-react-jsx",
                        ]
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader' // compiles Less to CSS
                    }
                ]
            },
            {   //使用css配置
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|svn|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[hash].[ext]',//所有图片在一个目录
                        }
                    }
                ]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: {
                    test: /\.jsx?$/
                },
                use: ['babel-loader', '@svgr/webpack', 'url-loader']
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/i,
                include: resolve('src/containers/webRtcLive/assets/iconfont'),
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        name: 'font/[name]-[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    priority: 0
                },
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 10
                }
            }
        }
    },
    performance: {
        // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
        hints: "warning",
        // 开发环境设置较大防止警告
        // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
        maxEntrypointSize: 500000000,
        // 最大单个资源体积，默认250000 (bytes)
        maxAssetSize: 300000000
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            minify: {
                removeComments: true,               //去注释
                collapseWhitespace: true,           //压缩空格
                removeAttributeQuotes: true         //去除属性引用
            }
        }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: false
        }), //打包进度显示
        new CopyWebpackPlugin([{
            from: __dirname + '/public/images',
            to: __dirname + '/dist/images'
        }, {
            from: __dirname + '/public/utf8-php',
            to: __dirname + '/dist/utf8-php'
        },])
        // new BundleAnalyzerPlugin(),//打包后各文件大小可视化显示
    ]
}