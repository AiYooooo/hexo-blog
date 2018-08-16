---
layout: post
title: "Nginx配置跨域信息"
date: 2018-8-16
author: "Ai Shuangying"
tags:
	- Nginx
---

----------

今天在搭建Vue项目时用到了Axios，在添加自定义头信息的时候遇到了问题，options验证阶段报错

'Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.'

在Nginx配置中加入允许的头部信息，再请求就顺利通过了。


### Nginx添加认证
-------------

```
	add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Headers Content-Type,Authorization;
    add_header Access-Control-Allow-Methods POST;
    add_header Access-Control-Allow-Methods GET;
```

添加了对自定义头 Content-Type 和 Authorization 的支持


### Axios
-------------

```
	axios.get(Url,{
	    headers: { 
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Authorization' : token
	    }
	}).then((response) => {
	    //处理成功回调
	}).catch((error) => {
	    //处理失败回调
	});
```
