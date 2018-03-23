---
layout: post
title: "使用Netlify部署静态网页"
subtitle: "不需要服务器或虚拟主机，免费"
date: 2018-2-10
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- Netlify
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


这两天看视频偶然发现的这个网站，很有意思，可以免费得部署静态文件，配置简单，并且支持绑定自己的域名，这里记录下来，分享给需要的同学。

----------


#### 网站注册
-------------


[Netlify](https://app.netlify.com)

可以使用Github账号直接登录。

-------------

#### 一键部署

首先，如果你使用的是React之类的框架，先build出静态文件包。

登录Netlify之后首页会显示一个拖拽框，直接将包含静态文件的文件夹拖拽进去就可以了。

稍等一下就部署成功了，这时候，会显示出网站自动生成的网址，类似 https://optimistic-northcutt-da4564.netlify.com 这样的，打开即可

这样就算部署成功了，但是域名并不好记，下面开始调整域名。


首页Overview下面可以看到你部署的项目的总览。

Site settings -> General -> Site details -> Change site name

输入需要自定的子域名即可，比如输入的是  test-app-name

修改成功后访问 https://test-app-name.netlify.com 即可。


那如果想绑定自己的域名呢？

首先你要有个自己的域名，类似  mywebsitename.com

Site settings -> Domain management -> Domains -> Add custom domain

输入自己的域名就可以了，接下来进行域名解析

解析采用CNAME方式，记录值填写你绑定的netlify项目地址，比如 test-app-name.netlify.com

解析成功后通过 test-app-name.mywebsitename.com 就可以正常访问了


是不是很简单！


