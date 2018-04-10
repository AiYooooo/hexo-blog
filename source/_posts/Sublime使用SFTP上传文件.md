---
layout: post
title: "Sublime使用SFTP上传文件"
date: 2018-3-13
author: "Ai Shuangying"
tags:
	- Sublime
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->

----------

鉴于我用的hexo来搭建博客，generate之后需要把静态文件上传到服务器上，然后才能在线上预览，但是每次都要打开FileZilla来上传很麻烦，所以这次我记录下来在Sublime里直接上传文件到服务器，其实很简单。


### 安装SFTP插件
-------------

``` bash
command + shift + p 打开 Package Control
输入install来查询 install Package
输入SFTP安装即可
```

### 配置SFTP
-------------

```
Sublime中左侧目录上选择需要存放待上传文件的本地文件夹右键，SFTP选项 Map to Remote...
如果已经配置了要修改就选择Edit Remote Mapping
在打开的配置信息里将下面五项修改好

	"host": "example.com",  
    "user": "username",  
    "password": "password",  
    "port": "22",  
      
    "remote_path": "/example/path/",

填入自己服务器对应的配置信息保存即可。

然后就可以使用 Upload folder来将本地文件上传至设定好的服务器路径文件夹下啦，是不是很简单。
```

如果不太清楚Sublime的基础使用，可以参考[Sulime安装插件](https://www.cnblogs.com/shiy/p/6507354.html)

另外如果提示需要注册，可以参考[SFTP注册码](https://blog.csdn.net/together_cz/article/details/74763474)来配置。

### 报错处理
-------------

上传过程中亲测可能会遇到Encoding problem的报错，其实就是你的文件及文件夹命名使用了非UTF-8编码导致的错误

比如我的文件有的使用了中文命名，那么上传过程中就会触发报错，如何解决呢？

[Encoding problem with SFTP](https://forum.sublimetext.com/t/encoding-problem-with-sftp-and-syncing-folder/13301)

既然我使用了中文，那么我就查一下看中文如何编码，参考

[编码格式介绍](http://www.cnblogs.com/lizhenghn/p/3690406.html)

可以看到我需要的是GBK编码格式，再次打开配置文件，里面有一行，默认是注释的，修改过来

```
	"remote_encoding": "GBK",
```

如果是其他语言引起的报错请自行查阅。

这下就好了，每次generate完直接右键Upload，网页刷新就可以看到啦！


------------

哇哇哇

这里除了一点问题，以上是在Windows系统下设置并成功的，但是今天在Mac下试了下，必须使用UTF-8才能上传成功，这是为什么呢？？

搜索了一下也没找到什么头绪，先留个坑，有同学知道的话欢迎联系我 aishuangying@gmail.com

