var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/jtml.js',
	devtool: 'source-map',
	output: {
		path: './lib',
		filename: 'jtml.js',
		library: 'jtml',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		loaders: [
			{
				loader: 'babel',
				test: /\.js$/,
				exclude: /node_modules/,
				query: {
					presets: ['es2015'],
					plugins: ['babel-plugin-add-module-exports']
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		}),
	]
};
