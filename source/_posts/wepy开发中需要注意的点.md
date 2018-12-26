---
layout: post
title: "wepy开发微信小程序过程中的要点"
date: 2018-12-26
author: "Ai Shuangying"
tags:
	- Wepy.js
	- 微信小程序
---

----------

最近根据公司需求，使用wepy搭建了一个小程序，这里记录部分需要注意的开发要点：


### 正常开发下缩小文件体积
-------------

关闭babel默认的sourceMap

```
	//wepy.config.js
	
	babel: {
		sourceMap: false
	}
```

Babel 是一个 JavaScript 编译器，通过语法转换器支持最新版本的 JavaScript，将其转译为能在旧版本浏览器或仅支持旧版本 JavaScript 的环境中能运行的脚本。

但是转义之后直接在浏览器或 Node.js 环境中运行的脚本将不再是我们最初所编写的代码了。

因此，我们需要配置 Source Maps，从而可以在调试时能够继续调试我们原始编写的代码。

但是在小程序开发中影响很小，所以关闭此功能可以大量减小程序包体的大小。




### 小程序分包
--------------

app.wpy中本来的页面列表是这样的

```
	pages: [
        'pages/login/login',
        'pages/login/signup',
        'pages/login/phoneCheck',
        'pages/login/resetPassword',
        'pages/main/main',
        'pages/msgs/detail',
        'pages/user/position',
        'pages/equips/zhinengshuibiao/index',
        'pages/equips/zhinengshuibiao/charts',
        'pages/equips/zhinengdianbiao/index',
        'pages/equips/zhinengdianbiao/charts',
        'pages/equips/zhinengmensuo/index',
        'pages/equips/zhinengyangan/index',
        'pages/equips/zhinengzhaoming/index',
        'pages/equips/yongdiananquan/index',
        'pages/equips/zhinengkongtiao/index'
    ],
```

改些成分包写法如下：

```
	pages: [
        'pages/login/login',
        'pages/login/signup',
        'pages/login/phoneCheck',
        'pages/login/resetPassword',
        'pages/main/main',
        'pages/msgs/detail',
        'pages/user/position'
    ],
    subPackages: [
        {
            root: 'pages/equips/',
            name: 'equippackage',
            pages: [
                'zhinengshuibiao/index',
                'zhinengshuibiao/charts',
                'zhinengdianbiao/index',
                'zhinengdianbiao/charts',
                'zhinengmensuo/index',
                'zhinengyangan/index',
                'zhinengzhaoming/index',
                'yongdiananquan/index',
                'zhinengkongtiao/index'
            ]
        }
    ],
    preloadRule: {
        "pages/main/main": {
            network: 'all',
            packages: ["equippackage"]
        }
    }
```

这里就是按照小程序官方的写法来做的，但是！！！

wepy打包后实际使用会报错！！

特别注意！！

特别注意！！

subpackages 这里一定要使用驼峰写法！！！

subPackages

这里跟小程序官方文档不同！！！！！！！
