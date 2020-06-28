const HTMLWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: { 
                                minimize: {
                                    removeComments: false,
                                    collapseWhitespace: true,
                                    posthtml: true
                                }
                            }
                        }
                    ]
            },
            {
                test: /\.(jpg|png|glb|mp4)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [ 
                        'css-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(gltf)$/,
                use: [
                    {
                        loader: "gltf-webpack-loader"
                    }
                ]
            },
            {
                test: /\.obj$/,
                loader: 'webpack-obj-loader'
            },
            {
                test: /\.(bin)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new ExtractTextPlugin("styles.css"),
        new CopyPlugin({
            patterns: [
              { from: 'src/title.html', to: 'title.html' },
              { from: 'src/assets/images/joeqj.png', to: 'joeqj.png' },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id],css"
        })
    ]
}