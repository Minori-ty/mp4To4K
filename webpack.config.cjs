const path = require('path')
module.exports = {
    mode: 'production',
    entry: './index.ts',
    target: 'node',
    cache: {
        type: 'filesystem',
    },
    output: {
        path: path.resolve(__dirname, `./dist/`),
        filename: 'index.js',
    },
    module: {
        rules: [
            // Use esbuild as a Babel alternative
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'ts', // Or 'ts' if you don't need tsx
                            target: 'es2015',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
