const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const entriesConfig = require("./entriesConfig.js").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
let entries = {
	uni: path.resolve(__dirname, "../main.js")
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
		// 模板
		// new HtmlWebpackPlugin({
		//   template: 'src/home/index.html',//模板文件
		//   filename: 'home.html',//目标文件
		//   chunks: ['uni', 'home'],//对应加载的资源
		//   inject: true,//资源加入到底部
		//   hash: true,
		//   minify: {
		//     removeComments: true,
		//     collapseWhitespace: true,
		//     removeAttributeQuotes: true
		//   }
		// }),
		...pluginArray,
		// 清除上一次构建
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		})
		// new webpack.HotModuleReplacementPlugin(),
	],
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				use: [
					"babel-loader",
					{
						loader: "eslint-loader",
						options: {
							// fix: true,
							emitError: true,
							formatter: require("eslint-friendly-formatter")
						}
					}
				],
				exclude: /node_modules/
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
			// 引入zepto
			{
				test: require.resolve("zepto"),
				loader: "exports-loader?window.Zepto!script-loader"
			}
		]
	},
	devServer: {
		host: "0.0.0.0", //地址
		port: 8080, //端口
		inline: true, // 实时刷新
		open: false, //自动打开浏览器
		hot: false,
		contentBase: path.join(__dirname, "dist"),
		historyApiFallback: true
	}
};
