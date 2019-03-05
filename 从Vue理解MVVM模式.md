---
layout: post
title: "从Vue理解MVVM模式"
date: 2019-02-20
author: "Ai Shuangying"
tags:
	- Vue
---

----------

最近重新梳理了一下Vue，对其双向绑定的原理做了简单了解，同时也对MVVM有了新的看法，做下记录。


### MVVM
-------------

即 Model-View-ViewModel 体系结构
    * View指的当然是用户界面，负责向用户呈现数据并接受反馈
    * Model则是程序中对事物的抽象，只是关注数据本身，并不关心行为
    * ViewModel则是真正的业务逻辑，处理Model的数据提供给View，接受View的操作进行响应

而Vue（和诸多类似的框架）则基本采用了数据劫持的方式来进行双向数据绑定

Vue采用 数据劫持&发布 - 订阅 模式，通过ES5提供的 Object.defineProperty() 方法来劫持（监控）各属性的 getter 、setter ，并在数据（对象）发生变动时通知订阅者，触发相应的监听回调。并且，由于是在不同的数据上触发同步，可以精确的将变更发送给绑定的视图，而不是对所有的数据都执行一次检测。要实现Vue中的双向数据绑定，大致可以划分三个模块：Compile、Observer、Watcher。

这里有一份自己实现的魔改Vue-MVVM的博客，写的很详细，需要的小伙伴可以仔细学习下。

[简单理解MVVM--实现Vue的MVVM模式](https://zhuanlan.zhihu.com/p/38296857)

[前后端分手大师——MVVM 模式](https://www.cnblogs.com/iovec/p/7840228.html)