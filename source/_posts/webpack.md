---
layout: post
title: "webpack初学笔记"
subtitle: "包含常见Loader、Plugin等"
date: 2018-2-2
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- webpack
---


记录自己学习及使用webpack过程中使用过的插件，用以查阅

----------


#### webpack
-------------



-------------

### [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

简化HTML文件的创建，支持定义模板，HTML压缩及单独添加JS、CSS文件等功能

这里还可以配置多个html页面，具体设置查询github或本案例源码

```
new HtmlWebpackPlugin({
	template: './index.html',
	filename: 'index.html',
	minify: {
      	collapseWhitespace: true,
    },
    hash: true,
})
```

### [css-loader](https://github.com/webpack-contrib/css-loader)
### [css-loader](https://github.com/webpack-contrib/sass-loader)

CSS文件处理

```
{ 
	test: /\.(css|scss)$/, 
	use: [ 'style-loader', 'css-loader', 'sass-loader' ] 
}
```

### [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)

把CSS分离成文件,目前这个插件尚不支持webpack4

```
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  	module: {
    	rules: [
      		{
		        test: /\.css$/,
		        use: ExtractTextPlugin.extract({
	          		fallback: "style-loader",
	          		use: "css-loader"
        		})
      		}
    	]
  	},
  	plugins: [
    	new ExtractTextPlugin("styles.css"),
  	]
}
```

### [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

本地开发利器，在本地上开启服务，自动打开浏览器并支持随修改刷新

```
const webpack = require('webpack');

devServer: {
    port: 9000,
    open: true,
    hot: true    //用来打开模块热更替
},

//使用热更替时，需要配置插件，不用安装
new webpack.NamedModulesPlugin(),
new webpack.HotModuleReplacementPlugin()

//同时如果出口处filename: '[name].[chunkhash].js',应修正为filename: '[name].[hash].js',
```


### 搭建React开发环境

必装包

```
npm install --save react react-dom
```

建立babel

```
npm install --save-dev babel-core babel-preset-react babel-preset-env
```

### [babel-loader](https://github.com/webpack-contrib/sass-loader)

转化React代码

```
{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
```

### [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)

用来清除文件，编译之前将dist文件夹清理干净，避免累积旧文件

```
new HtmlWebpackPlugin({
	template: './index.html',
	filename: 'index.html',
	minify: {
      	collapseWhitespace: true,
    },
    hash: true,
})
```

### [pug-html-loader](https://github.com/willyelm/pug-html-loader)

使用pug作为html的模板

```
//安装
npm install --save-dev pug pug-html-loader raw-loader

//配置
{ test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] }
```

### [file-loader](https://github.com/webpack-contrib/file-loader)

对一些对象作为文件来处理，然后可以返回它的URL。

```
{
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
      	{
	        loader: 'file-loader',
	        options: {}  
      	}
    ]
}
```

### [html-loader](https://github.com/webpack-contrib/html-loader)

把 html 变成导出成字符串的过程中，还能进行压缩处理（minimized）

```
{
  	test: /\.html$/,
  	use: [ {
    	loader: 'html-loader',
    	options: {
      		minimize: true
    	}
  	}],
}
```

### [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

自动压缩图片，生产环境拿到的图片就会很小

```
{
  	test: /\.(gif|png|jpe?g|svg)$/i,
  	use: [
    	{
      		loader: 'file-loader',
      		options: {
        		name: '[name].[ext]',
        		outputPath: 'images/'
      		}
    	},
    	{	
      		loader: 'image-webpack-loader',
      		options: {
        		bypassOnDebug: true,
      		}
    	}
  	]
},
```

