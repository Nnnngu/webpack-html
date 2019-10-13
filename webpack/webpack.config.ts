const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const entriesConfig = require("./entriesConfig.ts");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const EslintFriendlyFormatter = require("eslint-friendly-formatter");
const Happypack = require("happypack");
const autoprefixer = require("autoprefixer");
const uglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
// import config from '../config';
let entries = {
	uni: path.resolve(__dirname, "../main")
};
let pluginArray = [];
entriesConfig
	.filter(file => file)
	.forEach(item => {
		entries[item.filename] = path.resolve(__dirname, item.entrUrl);
		pluginArray.push(
			new HtmlWebpackPlugin({
				template: item.template,
				filename: `${item.filename}.html`,
				chunks: ["uni", item.filename],
				inject: true,
				hash: true,
				minify: {
					removeComments: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true
				}
			})
		);
	});

module.exports = {
	devtool: "eval-source-map", //开发使用,生产禁用
	entry: entries,
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "js/[name]-[hash].js"

		// publicPath:'' 正式版本的访问地址
	},
	plugins: [
		new uglifyWebpackPlugin(),
		new webpack.EnvironmentPlugin(["ENVIRONMENT"]),
		new HtmlWebpackPlugin({
			template: "index.html", //模板文件
			filename: "index.html", //目标文件
			chunks: ["uni"], //对应加载的资源
			inject: true, //资源加入到底部
			hash: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			}
		}),
		...pluginArray,
		// 清除上一次构建
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new Happypack({
			id: "babel",
			loaders: [
				{
					loader: "babel-loader",
					options: { cacheDirectory: true }
				}
			]
		}),
		new Happypack({
			id: "eslint",
			loaders: [
				{
					loader: "eslint-loader",
					options: {
						// fix: true,
						emitError: true,
						formatter: EslintFriendlyFormatter
					}
				}
			]
		})
		// new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			{
				test: /(\.jsx|\.js|\.ts)$/,
				use: ["happypack/loader?id=babel"],
				exclude: path.resolve(__dirname, "../node_modules"),
				include: path.resolve(__dirname, "../src")
			},
			{
				test: /\.ts?$/,
				use: ["ts-loader"],
				exclude: path.resolve(__dirname, "../node_modules")
			},
			{
				enforce: "pre",
				test: /(\.jsx|\.js|\.ts)$/,
				use: ["happypack/loader?id=eslint"],
				exclude: path.resolve(__dirname, "../node_modules")
			},
			{
				test: /\.(html)$/,
				use: {
					loader: "html-loader",
					options: {
						attrs: ["img:src"]
					}
				}
			},
			{
				test: /\.(css|scss)$/,
				use: [
					// 打包情况下将css抽离
					process.env.ENVIRONMENT === "development"
						? "style-loader"
						: MiniCssExtractPlugin.loader,
					"css-loader",

					{
						loader: "px2rem-loader",
						options: {
							remUnit: 16
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							sourceMap: true,
							plugins: [autoprefixer({ browsers: ["last 2 versions"] })]
						}
					},
					"sass-loader"
				]
			},
			{
				test: /\.(gif|png|jpe?g)$/i,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 20480,
							name: path.posix.join("static", "img/[name].[hash:7].[ext]")
						}
					}
				]
			},
			//引入zepto
			{
				test: require.resolve("zepto"),
				loader: "exports-loader?window.Zepto!script-loader"
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
		modules: [path.resolve(__dirname, '../src'), 'node_modules'],
		alias: {
			'@': path.resolve(__dirname, '../src'),
			'~': path.resolve(__dirname, '../'),
		}
	},
	devServer: {
		host: "0.0.0.0", //地址
		port: 3000, //端口
		inline: true, // 实时刷新
		open: false, //自动打开浏览器
		// hot: true,
		contentBase: path.join(__dirname, "dist"),
		historyApiFallback: true
	}
};
