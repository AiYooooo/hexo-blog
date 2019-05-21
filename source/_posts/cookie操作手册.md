---
layout: post
title: "cookie操作手册"
date: 2019-05-21
author: "Ai Shuangying"
tags:
	- JavaScript
---

----------

最近项目里又用到了cookie操作，这次记录下来。


### 代码
-------------

```
	// cookie.js
	export default {
	    setCookie: function (cname, cvalue, exdays) {
	        var d = new Date();
	        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	        var expires = "expires=" + d.toUTCString();
	        document.cookie = cname + "=" + cvalue + "; " + expires;
	    },
	    getCookie: function (cname) {
	        var name = cname + "=";
	        var ca = document.cookie.split(';');
	        for (var i = 0; i < ca.length; i++) {
	            var c = ca[i];
	            while (c.charAt(0) == ' ') c = c.substring(1);
	            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	        }
	        return "";
	    },
	    clearCookie: function (cname) {
	        this.setCookie(cname, "", -1);
	    },
	    checkCookie: function (cname) {
	        return this.getCookie(cname) != '';
	    }
	}
```

采用了模块语法，在需要的文件中可如下使用：

```
	import cookieTool from '../utils/cookie';

	cookieTool.setCookie('JSESSIONID', '********', 1);
	cookieTool.getCookie('JSESSIONID');
	cookieTool.clearCookie('JSESSIONID');
	cookieTool.checkCookie('JSESSIONID');  // true | false
```

