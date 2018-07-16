const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = {
    entry: (env !== 'production' ? [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
    ] : []).concat(['./client/index.js']),
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    plugins: env !== 'production' ? ["react-hot-loader/babel"] : []
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    }
};