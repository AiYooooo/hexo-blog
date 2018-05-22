---
layout: post
title: "简单的JQuery插件开发"
date: 2018-5-20
author: "Ai Shuangying"
tags:
	- JavaScript
---


最近手头的项目突然变成了jQuery项目，基于里面有很多共用的部分，为了最大限度得简洁代码，有没有合适的模块化方式，所以我干脆将其封装成jQuery的插件，通过预留容器、简单配置来达到各个页面共用的目的，目前处理了两个插件了，效果还不错。

[Github-HESC插件](https://github.com/AiYooooo/HESC-jquery-plugins)

----------


#### 简单的插件模板
-------------

```
; (function ($, window, document, undefined) {
    "use strict";
    var defaults = {
        
    };
    function PluginName($ele, options) {
        this.$ele = $ele;
        this.options = options = $.extend(defaults, options || {});
        this.init();
    }
    PluginName.prototype = {
        constructor: PluginName,
        init: function () {
            this.renderHtml();
            this.bindEvent();
        },
        renderHtml: function () {
            //这里在容器里插入HTML
        },
        bindEvent: function () {
            //这里针对HTML来绑定事件
        },
        clickPage: function (num) {
            //这里是事件处理函数，通过下面的方式来调用外部定义的回调函数，做交互
            this.options.chooseone(num);
        }
    };
    $.fn.PluginName = function (options) {
        options = $.extend(defaults, options || {});
        return new PluginName($(this), options);
    }
})(jQuery, window, document);
```

而HTML页上则只需要预留一个容器接口

在JS文件中初始化插件就可以了

```
app.get('*', function(req, res) {
  let callback = req.query.func;
  let content = callback+"({'message':'测试数据2'})";
  res.send(content);
});
```

通过动态插入script标签的方式，利用script标签的src属性发起请求，来达到跨域的目的。

jsonp的方式兼容性非常好，即便是那些老古董浏览器，也可以用jsonp的方式解决跨域问题，但是它也有所限制，它只能使用get方式发起请求，并且对于不同域之间页面的js互相调用无能为力。

jQuery很早就支持了jsonp的语法糖

```
    //HTML
    <div id="plugin_wrap"></div>

    //JS
    function choosepage (page){
        console.log('选择了页码：'+page);
    }   //监听回调
    $('#pager').AiPager({
        allpages: 20,
        chooseone: choosepage
    }); //在这里引入配置信息，回调函数也一起传入，在外面进行监听就可以了
```

这里有几个有意思的地方：

    * 最佳实践： 把 jQuery 传递给 IIFE（立即调用函数），并通过它映射成 $ ，这样就避免了在执行的作用域里被其它库所覆盖
    * 确保插件返回 this 关键字，这是为了保证插件的chainability（链式调用性）
    * 通过 $.extend 来合并传入配置和默认配置，从而使得传入配置可以尽量少
    * 永远不要在 jQuery.fn 对象中声明一个以上的名称空间
    * bind绑定事件时为绑定事件定义名称空间 $(window).bind('resize.tooltip', methods.reposition); $(window).unbind('.tooltip');



#### 存在问题
-------------

本着结构与样式分离的原则，这样的插件化除了需要引入相应的js文件外，还需要引入对应的css文件，略显繁琐，更好的处理方法待补充。


