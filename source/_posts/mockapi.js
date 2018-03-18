---
layout: post
title: "介绍两种常用的前端api模拟工具"
subtitle: "mockapi 及 json-server"
date: 2018-2-6
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- mockAPI
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


考虑到前端开发通常与后端开发并行，依托接口文档来预写逻辑，这就需要有api模拟工具来提供模拟数据，这里简单记录两个用到的还不错的工具。

----------


#### mockapi
-------------


官方网站 [mockapi](http://www.mockapi.io/)

登陆后即可创建项目，每个项目都会分配一个地址类似：http(s)://5aae20d37389ab0014b7b919.mockapi.io/api/v1/

这个时候就可以创建源了，比如我们创建一个testuser源，填入初始数据，这里支持为源单独定义方法

```
{
	'id': 'id',
	'name': 'aishuangying',
	'age': 26
}
```

然后通过 GET http(s)://5aae20d37389ab0014b7b919.mockapi.io/api/v1/testuser 就可以获取到数据啦。

可以通过 bash 里面  $ curl https://5aae20d37389ab0014b7b919.mockapi.io/api/v1/testuser 来显示数据

或者通过 postman 来读取数据，注意如果获取不到就采用 http 协议。

-------------

#### json-server


Github [json-server](https://github.com/typicode/json-server)

首先全局安装

```
	npm install -g json-server
```

在项目中创建一个db.json文件，填入初始数据

```
{
	"records" : [
		{
			"id": 1,
			"name": "aishuangying",
			"age": 26
		}
	]
}

//接着启动它就可以了
json-server --watch db.json --port 3008

//然后请求 localhost:3008/records 就可以得到数据啦
```

以上都是GET请求，如果用POST请求，参数带一样形式的JSON，到同一地址就可以创建一条新的数据插入到队尾。

如果是json-server这种方式的话POST的header的content-type 选用x-www-form-urlencoded，mockapi的话则选用 raw

