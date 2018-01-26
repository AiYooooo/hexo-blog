---
layout: post
title: "Koa学习笔记 一"
subtitle: "基本用法"
date: 2018-1-1
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - Node.js
    - Koa
---


这个系列将记载我在学习Koa过程中需要记录下来的重点和遇到的问题。
[中文文档](https://koa.bootcss.com/)
[英文文档](http://koajs.com)

----------

### 安装koa
-------------

Koa 依赖 node v7.6.0 或 ES2015及更高版本和 async 方法支持

这里提供将升级本地node版本的方法

先查看本机node.js版本：

```
    $ node -v
```

清除node.js的cache：(此步会要求输入密码)

```
    $ sudo npm cache clean -f
```

安装 n 工具，这个工具是专门用来管理node.js版本的

```
    $ sudo npm install -g n
```

安装最新版本的node.js

```
    $ sudo n stable
```

再次查看本机的node.js版本：(本文采用的node版本为9.4.0)

```
    $ node -v
```

安装koa

```
    $ npm i koa
```


### 架设HTTP服务
-------------

```
    const Koa = require('koa');
	const app = new Koa();

	app.listen(3000);
```

这里的 app.listen(...) 方法只是以下方法的语法糖:

```
    const http = require('http');
	const Koa = require('koa');
	const app = new Koa();
	http.createServer(app.callback()).listen(3000);
```

这意味着您可以将同一个应用程序同时作为 HTTP 和 HTTPS 或多个地址：

```
    const http = require('http');
	const https = require('https');
	const Koa = require('koa');
	const app = new Koa();
	http.createServer(app.callback()).listen(3000);
	https.createServer(app.callback()).listen(3001);
```


### 上下文对象 Context
-------------

Koa 提供一个 Context 对象，表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。通过加工这个对象，就可以控制返回给用户的内容。

```
	app.use(async ctx => {
	  	ctx; 			// 这是 Context
	  	ctx.req; 		// 这是 Node Request
	  	ctx.res; 		// 这是 Node Response  绕过 Koa 的 response 处理是 不被支持的. 
	  	ctx.request; 	// 这是 koa Request
	  	ctx.response; 	// 这是 koa Response

	  	ctx.request.header   	//请求标头对象。
	  	ctx.request.header=   	//设置请求标头对象。
	  	ctx.request.method   	//请求方法。
	  	ctx.request.method=   	//设置请求方法，对于实现诸如 methodOverride() 的中间件是有用的。
	  	ctx.request.length   	//返回以数字返回请求的 Content-Length，或 undefined。
	  	ctx.request.url   		//获取请求 URL.
	  	ctx.request.url=    	//设置请求 URL, 对 url 重写有用。
	  	ctx.request.origin   	//获取URL的来源，包括 protocol 和 host。
	  	ctx.request.href    	//获取完整的请求URL，包括 protocol，host 和 url。
	  	ctx.request.path   	    //获取请求路径名。
	  	ctx.request.querystring //根据 ? 获取原始查询字符串.
	  	ctx.request.search   	//使用 ? 获取原始查询字符串。
	  	ctx.request.query   	//获取解析的查询字符串, 当没有查询字符串时，返回一个空对象。请注意，此 getter 不 支持嵌套解析。
	});
```

Context.response.body属性就是发送给用户的内容。

```
    const Koa = require('koa');
	const app = new Koa();
	const main = ctx => {
	  	ctx.response.body = 'Hello World';
	};
	app.use(main);
	app.listen(3000);
```

```
    ctx.response.type = 'json / xml / html / text'; //这些都是response的类型
```

```
    const main = ctx => {
	  	ctx.response.type = 'html';
	  	ctx.response.body = fs.createReadStream('./demos/template.html');
	};    //返回一个网页模板
```

ctx.cookies用来读写 Cookie

```
	const main = function(ctx) {
  		const n = Number(ctx.cookies.get('view') || 0) + 1;
  		ctx.cookies.set('view', n);
  		ctx.response.body = n + ' views';
	}
```

### 路由
-------------

这里使用koa自带的koa-route 模块

```
    const route = require('koa-route');

	const about = ctx => {
	  	ctx.response.type = 'html';
	  	ctx.response.body = '<a href="/">Index Page</a>';
	};

	const main = ctx => {
	  	ctx.response.body = 'Hello World';
	};

	app.use(route.get('/', main));
	app.use(route.get('/about', about));
```

静态资源访问则使用koa自带的koa-static模块

```
    const path = require('path');
	const serve = require('koa-static');

	const main = serve(path.join(__dirname));
	app.use(main);
```

重定向

```
    const redirect = ctx => {
  		ctx.response.redirect('/');
  		ctx.response.body = '<a href="/">Index Page</a>';
	};

	app.use(route.get('/redirect', redirect));  //访问'/redirect'的请求会被重定向到'/'
```


### 中间件
-------------

基本上，Koa 所有的功能都是通过中间件实现的。
中间件的实现很简单，所谓中间件可以看做是有两个参数的函数，用来在 HTTP Request 和 HTTP Response 中间实现某种功能。

```
	//一个非常简单的输出log的中间件函数
    const logger = (ctx, next) => {
  		console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  		next();
	}
	app.use(logger);
```

如果对进程添加很多中间件的话会怎么样呢？
多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。

也就是说，会从上至下依次进入每个中间件，但只有在最内层中间件执行完毕后才会一层层返回到最外层中间件，示例如下：

```
	const one = (ctx, next) => {
	  	console.log('>> one');
	  	next();
	  	console.log('<< one');
	}
	const two = (ctx, next) => {
	  	console.log('>> two');
	  	next(); 
	  	console.log('<< two');
	}
	const three = (ctx, next) => {
	  	console.log('>> three');
	  	next();
	  	console.log('<< three');
	}

	app.use(one);
	app.use(two);
	app.use(three);
```

此时的输出应该是

```
	>> one
	>> two
	>> three
	<< three
	<< two
	<< one
```

这是全同步中间件的执行流程，如果这些中间件中包含异步操作，那么执行的流程就会发生变化

首先，包含异步操作的中间件必须写成async函数

```
	//这就是一个异步中间件
	const main = async function (ctx, next) {
	  	ctx.response.type = 'html';
	  	ctx.response.body = await fs.readFile('./demos/template.html', 'utf8');
	};

	app.use(main);
```

中间件的合成则可以使用 koa-compose 模块

```
	const compose = require('koa-compose');

	const logger = (ctx, next) => {
	  	console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
	  	next();
	}

	const main = ctx => {
	  	ctx.response.body = 'Hello World';
	};

	const middlewares = compose([logger, main]);
	app.use(middlewares);
```

从 POST 请求的数据体里面提取键值对使用 koa-body 模块

```
	const koaBody = require('koa-body');

	const main = async function(ctx) {
	  	const body = ctx.request.body;
	  	if (!body.name) ctx.throw(400, '.name required');
	  	ctx.body = { name: body.name };
	};

	app.use(koaBody());
```



### 错误处理
-------------

直接抛出错误

```
	const main = ctx => {
  		ctx.throw(500);
	};
```

返回错误

```
	const main = ctx => {
  		ctx.response.status = 404;
  		ctx.response.body = 'Page Not Found';
	};
```

为了方便处理错误，最好使用try...catch将其捕获。但是，为每个中间件都写try...catch太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

```
	const handler = async (ctx, next) => {
	  	try {
	    	await next();
	  	}catch (err) {
	    	ctx.response.status = err.statusCode || err.status || 500;
	    	ctx.response.body = {
	      		message: err.message
	    	};
	  	}
	};

	const main = ctx => {
	  	ctx.throw(500);
	};

	app.use(handler);
	app.use(main);
```

app监听错误的处理方法

```
	app.on('error', (err, ctx) =>
  		console.error('server error', err);
	);
```

需要注意的是，如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效。

```
	const handler = async (ctx, next) => {
	  	try {
	    	await next();
	  	} catch (err) {
	    	ctx.response.status = err.statusCode || err.status || 500;
	    	ctx.response.type = 'html';
	    	ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
	    	ctx.app.emit('error', err, ctx);
	  	}
	};
```


参考：
[阮一峰koa教程](http://www.ruanyifeng.com/blog/2017/08/koa.html)
