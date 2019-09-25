import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path'
module.exports = {
  devtool: 'eval-source-map', //开发使用,生产禁用
  entry: {
    uni: path.resolve(__dirname, '../main.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name]-[chunkhash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',//模板文件
      filename: 'index.html',//目标文件
      chunks: ['uni'],//对应加载的资源
      inject: true,//资源加入到底部
      hash: true//加入版本号
    })
  ],
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      },
      // 引入zepto
      {
        test: require.resolve('zepto'),
        loader: 'exports-loader?window.Zepto!script-loader'
      }
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    inline: true, // 实时刷新
    open: true,   //自动打开浏览器
    hot: false,   //慎用！打开热更新，会导致修改样式可能不支持。关闭热更新，页面会强刷
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
  },
}
