---
layout: post
title: "San学习笔记 一"
subtitle: "基本用法"
date: 2018-1-5
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - San
---


最近关注了一个极简MVVM框架San，翻了一遍San的文档，做些笔记。
[中文文档](https://ecomfe.github.io/san/tutorial/start/)

----------

### 数据相关
-------------


```
    var MyApp = san.defineComponent({
	    template: '<p>Hello {{name}}!</p>',

	    initData: function () {
	        return {
	            name: 'San'
	        };
	    }
	});

	var myApp = new MyApp();
	myApp.attach(document.body);
```

可以看到，通常情况实用 San 会经过这么几步：

* 我们先定义了一个 San 的组件，在定义时指定了组件的 内容模板 与 初始数据 。
* 初始化组件对象
* 让组件在相应的地方渲染

列表渲染(s-for)

```
    var MyApp = san.defineComponent({
	    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

	    attached: function () {
	        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
	    }
	});

	var myApp = new MyApp();
	myApp.attach(document.body);
```


#### 数据的绑定

双向绑定({=  =})

```
    var MyApp = san.defineComponent({
	    template: ''
	        + '<div>'
	        +   '<input value="{= name =}" placeholder="please input">'
	        +   'Hello {{name}}!'
	        + '</div>'
	});

	var myApp = new MyApp();
	myApp.attach(document.body);

	<input type="text" value="{= name =}">

	<select value="{= online =}">
	    <option value="errorrik">errorrik</option>
	    <option value="otakustay">otakustay</option>
	    <option value="firede">firede</option>
	</select>
```

属性绑定

```
    <ui-label text="{{jokeName}}"></ui-label>
```

输出原封不动的 HTML，不希望经过 HTML 转义。

```
    <p s-html="rawHTML"></p>    //通过指令 s-html
	<p>{{rawHTML | raw}}</p>	//通过过滤器raw
```


#### 数据的操作
-------------

initData 方法：可以在定义组件时指定组件初始化时的数据。initData 方法返回组件实例的初始化数据。

```
    san.defineComponent({
	    initData: function () {
	        return {
	            width: 200,
	            top: 100,
	            left: -1000
	        };
	    }
	});
```

set 方法：是最常用的操作数据的方法，作用相当于 JavaScript 中的赋值 (=)。

```
    san.defineComponent({
	    attached: function () {
	        requestUser().then(this.userReceived.bind(this));
	    },

	    userReceived: function (data) {
	        this.data.set('user', data);
	    },

	    changeEmail: function (email) {
	        this.data.set('user.email', email);
	    }
	});
```

merge 方法：将目标数据对象（target）和传入数据对象（source）的键进行合并。

```
    san.defineComponent({
	    attached: function () {
	        requestUser().then(this.updateUserInfo.bind(this));
	    },

	    updateUserInfo: function (data) {
	        this.data.merge('user', data);
	    }
	});
```

apply 方法：接受一个函数作为参数，传入当前的值到函数，然后用新返回的值更新它。

```
    san.defineComponent({
	    attached: function () {
	        this.data.set('number', {
	            value: 1
	        });
	        this.updateNumber();
	    },

	    updateNumber: function (data) {
	        this.data.apply('number', function (number) {
	            return {
	                value: number.value * 2
	            };
	        })
	    }
	});
```

还有一些数组方法：

修改数组项还是直接使用 set 方法。

push：在数组末尾插入一条数据。

```
    san.defineComponent({
	    addUser: function (name) {
	        this.data.push('users', {name: name});
	    }
	});
```

pop：在数组末尾弹出一条数据。

```
    san.defineComponent({
	    rmLast: function () {
	        this.data.pop('users');
	    }
	});
```

unshift：在数组开始插入一条数据。

```
    san.defineComponent({
	    addUser: function (name) {
	        this.data.unshift('users', {name: name});
	    }
	});
```

shift：在数组开始弹出一条数据。

```
    san.defineComponent({
	    rmFirst: function () {
	        this.data.shift('users');
	    }
	});
```

remove：移除一条数据。只有当数组项与传入项完全相等(===)时，数组项才会被移除。

```
    san.defineComponent({
	    rm: function (user) {
	        this.data.remove('users', user);
	    }
	});
```

removeAt：通过数据项的索引移除一条数据。

```
    san.defineComponent({
	    rmAt: function (index) {
	        this.data.removeAt('users', index);
	    }
	});
```

splice：向数组中添加或删除项目。

```
    san.defineComponent({
	    rm: function (index, deleteCount) {
	        this.data.splice('users', [index, deleteCount]);
	    }
	});
```


#### 数据的校验
-------------

指定校验规则，需要使用 DataTypes 进行声明：

```
    import san, {DataTypes} from 'san';

	let MyComponent = san.defineComponent({

	    dataTypes: {
	        name: DataTypes.string
	    }

	});
```

