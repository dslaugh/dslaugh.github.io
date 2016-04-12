var path = require('path');

module.exports = {
    entry: './js/entry.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'js'),
                loader: 'babel-loader',
                query: {
                    presets: 'babel-preset-es2015'
                }
            }
        ]
    }
}
