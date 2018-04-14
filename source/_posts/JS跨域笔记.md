---
layout: post
title: "常见的几种跨域方法"
date: 2018-3-28
author: "Ai Shuangying"
tags:
	- JavaScript
---


当发送网络请求时，如果同一协议、同一域名、同一端口三个条件有一个不满足，浏览器就会报错。
No 'Access-Control-Allow-Origin' header is present on the requested resource

总结一下常见的几种跨域方法。

----------


#### JSONP跨域
-------------

原理：浏览器对于script，iframe等标签的src等属性，是没有同源策略限制的。

看下面的代码：

```
function showJsonp(obj){
  console.log(obj.message);
}
var url = 'http://127.0.0.1:8787/?func=showJsonp'
var script = document.createElement('script');
script.setAttribute('src',url);
script.setAttribute('type','text/javascript');
document.getElementsByTagName('head')[0].appendChild(script);
```

创建一个script标签，发起请求时，url后跟了一个名为func的参数，而这个参数就是之后需要用到的回调函数名称。

后台对应的处理代码：

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
$.ajax({
    url:'http://127.0.0.1:1234/',
    dataType:"jsonp", //告知jQ我们走的JSONP形式
    jsonpCallback:"abc", //callback名
    success:function(data){
        console.log(data)
    }
});
```


#### CORS
-------------

原理：要求当前域（常规为存放资源的服务器）在响应报头添加Access-Control-Allow-Origin标签，从而允许指定域的站点访问当前域上的资源。

CORS主要是在服务端来实现跨域功能，客户端的实现跟常规的请求基本一致。

```
require("http").createServer(function(req,res){
  res.setHeader("Access-Control-Allow-Origin","http://127.0.0.1");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, HEAD, PATCH"
  );
  res.end(req.method+" "+req.url);
}).listen(1234);
```

不过CORS默认只支持GET/POST这两种http请求类型，如果要开启PUT/DELETE之类的方式，需要在服务端在添加一个"Access-Control-Allow-Methods"报头标签。


#### Cross-document messaging
-------------

在 Cross-document messaging 中，我们可以使用 postMessage 方法和 onmessage 事件来实现不同域之间的通信

其中postMessage用于实时向接收信息的页面发送消息 otherWindow.postMessage(message, targetOrigin);

    otherWindow:            对接收信息页面的window的引用。可以是页面中iframe的contentWindow属性；
    window.open的返回值；    通过name或下标从window.frames取到的值。
    message:                所要发送的数据，string类型。
    targetOrigin:           允许通信的域的url，*表示不作限制。

可以在父页面中嵌入不同域的子页面（iframe实现，而且常规会把它隐藏掉），在子页面调用 postMessage 方法向父页面发送数据：

```
<iframe style="display:none;" id="ifr" src="http://127.0.0.1:10847/sop/b.html"></iframe>
<script type="text/javascript">
    window.addEventListener('message', function(event){
        // 通过origin属性判断消息来源地址
        if (event.origin == 'http://127.0.0.1:10847') {
            alert(event.data);    // 弹出从子页面post过来的信息
        }
    }, false);
</script>
```

http://127.0.0.1:10847/sop/b.html

```
<script type="text/javascript">
    var ifr = window.parent;  //获取父窗体
    var targetOrigin = 'http://localhost:10847';  // 若写成 http://127.0.0.1:10847 则将无法执行postMessage
    ifr.postMessage('这是传递给a.html的信息', targetOrigin);
</script>
```


#### Websocket
-------------

WebSocket protocol 是HTML5一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是server push技术的一种很棒的实现。

```
var ws = new WebSocket('ws://127.0.0.1:8080/url'); 
    //新建一个WebSocket对象，注意服务器端的协议必须为“ws://”或“wss://”
    //其中ws开头是普通的websocket连接，wss是安全的websocket连接，类似于https。
ws.onopen = function() {
    // 连接被打开时调用
};
ws.onerror = function(e) {
    // 在出现错误时调用，例如在连接断掉时
};
ws.onclose = function() {
    // 在连接被关闭时调用
};
ws.onmessage = function(msg) {
    // 在服务器端向客户端发送消息时调用
    // msg.data包含了消息
};
// 这里是如何给服务器端发送一些数据
ws.send('some data');
// 关闭套接口
ws.close();
```

但是一般情况下使用 socket.io 来向下兼容


#### document.domain
-------------

只适合主域相同但子域不同的情况，比如 a.com 和 www.a.com，我们只需要给这两个页面都加上一句 document.domain = 'a.com'，就可以在其中一个页面嵌套另一个页面，然后进行窗体间的交互。

```
<iframe src="http://www.a.com:8080/sop/b.html"></iframe>
<script>
    document.domain = 'a.com';
    $("iframe").load(function(){
        $(this).contents().find("div").text("OK")
    })
</script>
```

在b.html中只要也声明document.domain就可以了

```
<script>
    document.domain = 'a.com';
</script>
```

可以看到a.html中JS成功修改了b.html中的内容。


#### location.hash

#### window.name
-------------------

这两个东西用的很少，使用起来也很复杂，需要的话再自行查找。


#### 服务器代理
-------------------

原理：页面直接向同域的服务端发请求，服务端进行跨域处理或爬虫后，再把数据返回给客户端页面。
