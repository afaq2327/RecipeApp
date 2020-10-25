const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ['babel-polyfill','./src/js/index.js'],//entry points
    output:{//exit point
        path:path.resolve(__dirname, 'dist/js'),
        filename:'js/bundle.js'
    },
    devServer:{//webpack development server
        contentBase: './dist'
    },
    plugins:[//for automatically copying the html file to distribution
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module:{//babel loader to convert es6 to es5
        rules: [
            {
                test:/\.js$/,//test all the files to find javascript files
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            }
        ]
    }
};