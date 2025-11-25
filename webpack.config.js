const { default: WebpackUserscript } = require('webpack-userscript');
const path = require('path');
const pkg = require('./package.json');
const isProduction = process.env.NODE_ENV === 'production';
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    // 1. 入口点更新为 .ts 文件
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction
            ? `${pkg.name}-${pkg.version}.user.js`
            : `${pkg.name}.dev.user.js`
    },
    // 2. 添加 module.rules 来处理 .ts 文件
    module: {
        rules: [
            {
                test: /\.tsx?$/, // 匹配 .ts 或 .tsx 文件
                use: 'ts-loader', // 使用 ts-loader 来编译
                exclude: /node_modules/,
            },
        ],
    },
    // 3. 添加 resolve.extensions 方便模块导入
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new WebpackUserscript({
            headers: {
                name: 'Pixiv 功能增强 Pro / Pixiv Enhancer Pro',
                version: pkg.version,
                author: pkg.author,
                description: pkg.description,
                match: '*://www.pixiv.net/*',
                // 4. 为 GM_addStyle 添加授权
                grant: [
                    'GM_addStyle',
                    'GM_download',
                    'GM_getValue',
                    'GM_setValue'
                ]
            }
        }),
        new webpack.DefinePlugin({
            'SCRIPT_VERSION': JSON.stringify(pkg.version)
        })
    ],
   externals: [
        /^GM_.*$/
   ]
};
