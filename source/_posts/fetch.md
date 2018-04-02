---
layout: post
title: "fetch笔记"
subtitle: "新的数据获取解决方案"
date: 2018-3-3
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- fetch
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


最近的一个项目里尝试使用了fetch来获取数据，做个笔记备用。

----------


#### 简单了解
-------------

fetch实际上就是XMLHttpRequest的一种替代方案，同样是用来获取后台数据的。

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API#%E6%A6%82%E5%BF%B5%E5%92%8C%E7%94%A8%E6%B3%95)

先来写个简单的形式：
```
	fetch(url) 								// 请求一个url地址，返回一个Promise对象
  		.then((res)=>{
  			console.log(res.status);		//拿到response的状态码
    		return res.text() 				// 拿到这个res对象做处理
  		})
  		.then((text)=>{
    		console.log(text) 				// 处理过的数据进行操作
  		})
  		.catch(function(err){
    		console.log("Fetch错误:"+err);	//错误收集
		})
```

是不是很简单。

接下来进行配置。

-------------

#### GET请求

为fetch做配置应添加到fetch的第二个参数上，如果需要传参，只能拼接到url上了。

```
	fetch(url+'?a=1&b=2', {
    		method: 'GET'
  		}) 						// GET方式请求一个url地址，返回一个Promise对象
  		.then((res)=>{
    		return res.text() 	// 拿到这个res对象做处理
  		})
  		.then((text)=>{
    		console.log(text) 	// 处理过的数据进行操作
  		})
```

-------------

#### POST请求

POST方式的参数应添加到body上，对于fetch的body，可以是以下任何类型的实例：

POST请求的默认头信息是：Content-Type:text/plain;charset=UTF-8，如果要修改头信息，请添加到headers里面。


	* ArrayBuffer
	* ArrayBufferView (Uint8Array and friends)
	* Blob/File
	* string
	* URLSearchParams
	* FormData

```
	fetch(url, {
    		method: 'POST',
    		headers: new Headers({
      			'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    		}),
    		body: new URLSearchParams([["foo", 1],["bar", 2]]).toString() // 这里是请求对象
  		}) 						// GET方式请求一个url地址，返回一个Promise对象
  		.then((res)=>{
    		return res.text() 	// 拿到这个res对象做处理
  		})
  		.then((text)=>{
    		console.log(text) 	// 处理过的数据进行操作
  		})
```


-------------

#### 示例：获取JSON

```
	fetch(url, {
	    	method: 'GET',
	    	headers: new Headers({
	      		'Accept': 'application/json' // 通过头指定，获取的数据类型是JSON
	    	})
  		})
  		.then((res)=>{
    		return res.json() // 返回一个Promise，可以解析成JSON
  		})
  		.then((res)=>{
    		console.log(res) // 获取JSON数据
  		})
```


-------------

#### 示例：带cookie

默认情况下, fetch 不会从服务端发送或接收任何 cookies
也就是说如果网站需要用户认证，直接发送fetch请求会无法识别(要发送 cookies，必须发送凭据头).

```
	fetch(url, {
	    	method: 'GET',
	    	credentials: 'include' // 强制加入凭据头
  		})
  		.then((res)=>{
    		return res.json() // 返回一个Promise，可以解析成JSON
  		})
  		.then((res)=>{
    		console.log(res) // 获取JSON数据
  		})
```


-------------

#### 示例：封装

```
	/**
 		* 将对象转成 a=1&b=2的形式
 		* @param obj 对象
 		* 将对象的属性抽离出来
 	*/
	function obj2String(obj, arr = [], idx = 0) {
  		for (let item in obj) {
    		arr[idx++] = [item, obj[item]]
  		}
  		return new URLSearchParams(arr).toString()
	}

	/**
	 	* 真正的请求
	 	* @param url 请求地址
	 	* @param options 请求参数
	 	* @param method 请求方式
 	*/
	function commonFetcdh(url, options, method = 'GET') {
  		const searchStr = obj2String(options)
  		let initObj = {}
  		if (method === 'GET') { // 如果是GET请求，拼接url
    		url += '?' + searchStr
    		initObj = {
      			method: method,
      			credentials: 'include'
    		}
  		} else {
    		initObj = {
      			method: method,
      			credentials: 'include',
      			headers: new Headers({
        			'Accept': 'application/json',
        			'Content-Type': 'application/x-www-form-urlencoded'
      			}),
      			body: searchStr
    		}
  		}
  		fetch(url, initObj).then((res) => {
    		return res.json()
  		}).then((res) => {
    		return res
  		})
	}

	/**
	 	* GET请求
	 	* @param url 请求地址
	 	* @param options 请求参数
 	*/
	function GET(url, options) {
  		return commonFetcdh(url, options, 'GET')
	}

	/**
	 	* POST请求
	 	* @param url 请求地址
	 	* @param options 请求参数
 	*/
	function POST(url, options) {
  		return commonFetcdh(url, options, 'POST')
	}

	/**
	 	* 使用参考
 	*/
	GET('https://www.baidu.com/search/error.html', {a:1,b:2})
	POST('https://www.baidu.com/search/error.html', {a:1,b:2})
```


参考：

[fetch，终于认识你](https://segmentfault.com/a/1190000011433064)

