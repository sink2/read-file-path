import path from 'path';

export default {
    entry: path.resolve(__dirname, './src/read-file-path.js'),
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'app.js',
    },
    mode: "production",
    resolve: {
        extensions: ['*', '.js'],
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ],
            }
        ]
    }
}