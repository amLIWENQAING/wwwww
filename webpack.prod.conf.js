const merge = require('webpack-merge');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const common = require('./webpack.common.conf');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJS = require("uglify-js");
const fs = require('fs');
const zopfli = require('node-zopfli');
 
module.exports = merge(common, {
    mode:'production',
    // devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CompressionPlugin({   //压缩文件gzip/  nginx需配置 gzip_static on;
            filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip',//算法
            test: new RegExp(
              '\\.(js|css)$'  //压缩 js 与 css
            ),
            threshold: 10240,//只处理比这个值大的资源。按字节计算
            minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
        }),
    ]
})