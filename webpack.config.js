const webpack = require('webpack');
const path = require('path');

const config = {
    devtool: 'source-map',
    entry: {
        core: './envyconf.js',
    },
    node: { fs: "empty" },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `envyconf.js`,
        library: 'envyConf',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /.*\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ]
    },
};

module.exports = config;
