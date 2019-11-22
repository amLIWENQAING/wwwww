const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.conf');
const CopyPlugin = require('copy-webpack-plugin');
 
module.exports = merge(common, {
    mode:'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8001,
        historyApiFallback: true,//使能历史记录api
        hot: true,//关闭热替换 注释掉这行就行
        // host: 'localhost',
        host: '58.154.51.165',
        // https:true,
        disableHostCheck: true,
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        overlay: {
            errors: true,
            warnings: true,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
})