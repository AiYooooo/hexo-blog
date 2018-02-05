---
layout: post
title: "San学习笔记 五"
subtitle: "组件"
date: 2018-1-14
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - San
---


最近关注了一个极简MVVM框架San，翻了一遍San的文档，做些笔记。
[中文文档](https://ecomfe.github.io/san/tutorial/start/)

----------

### 组件
-------------

组件是 San 的基本单位，是独立的数据、逻辑、视图的封装单元。从页面的角度看，组件是 HTML 元素的扩展。从功能模式的角度看，组件是一个 ViewModel。

如何定义组件？

如果不使用ESNext，San 提供了快捷方法 san.defineComponent 用于方便地定义组件。

```
    var MyApp = san.defineComponent({
	    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

	    attached: function () {
	        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
	    }
	});
```

如果使用ESNext，通过 ESNext 的 extends 继承时，template / filters / components 属性请使用 static property 的方式定义。

```
    import {Component} from 'san';

	class HelloComponent extends Component {
	    constructor(options) {
	        super(options);
	        // .....
	    }
	    static template = '<p>Hello {{name}}!</p>';
	    initData() {
	        return {name: 'San'}
	    }
	}

	new HelloComponent().attach(document.body);
```


#### 生命周期

* compiled  - 组件视图模板编译完成
* inited    - 组件实例初始化完成
* created   - 组件元素创建完成
* attached  - 组件已被附加到页面中
* detached  - 组件从页面中移除
* disposed  - 组件卸载完成

组件的生命周期有这样的一些特点：

* 生命周期代表组件的状态，生命周期本质就是状态管理。
* 在生命周期到达时，对应的钩子函数会被触发运行。
* 并存。比如 attached 和 created 等状态是同时并存的。
* 互斥。attached 和 detached 是互斥的，disposed 会互斥掉其它所有的状态。
* 有的时间点并不代表组件状态，只代表某个行为。当行为完成时，钩子函数也会触发。如 updated 代表每次数据变化导致的视图变更完成。


通过声明周期的钩子函数，我们可以在生命周期到达时做一些事情。比如在生命周期 attached 中发起获取数据的请求，在请求返回后更新数据，使视图刷新。

```
    var ListComponent = san.defineComponent({
	    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

	    initData: function () {
	        return {
	            list: []
	        };
	    },

	    attached: function () {
	        requestList().then(this.updateList.bind(this));
	    },

	    updateList: function (list) {
	        this.data.set('list', list);
	    }
	});
```

#### 数据

所有组件数据相关的操作，都由组件实例的 data 成员提供。

通过 data.get 方法可以获取数据

```
    san.defineComponent({
	    attached: function () {
	        var params = this.data.get('params');
	        this.data.set('list', getList(params[1]));
	    }
	});
```

组件在实例化时可以通过 option 传入 data，指定组件初始化时的数据

```
    var MyApp = san.defineComponent({
	    template: '<ul><li s-for="item in list">{{item}}</li></ul>'
	});

	var myApp = new MyApp({
	    data: {
	        list: ['san', 'er', 'esui', 'etpl', 'esl']
	    }
	});
	myApp.attach(document.body);
```

new 时传入初始数据是针对实例的特例需求。

但如果我们在定义组件时希望每个实例都具有初始的一些数据，此时可以定义 initData 方法，可以在定义组件时指定组件初始化时的数据。initData 方法返回组件实例的初始化数据。

```
	var MyApp = san.defineComponent({
	    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

	    initData: function () {
	        return {
	            list: ['san', 'er', 'esui', 'etpl', 'esl']
	        };
	    }
	});

	var myApp = new MyApp();
	myApp.attach(document.body);
```

计算数据

一个数据项的值可能由其他数据项计算得来，这时我们可以通过 computed 定义计算数据。 

computed 是一个对象，key 为计算数据项的名称，value 是返回数据项值的函数。

```
	san.defineComponent({
	    template: '<a>{{info}}</a>',

	    // name 数据项由 firstName 和 lastName 计算得来
	    computed: {
	        name: function () {
	            return this.data.get('firstName') + ' ' + this.data.get('lastName');
	        },

	        info: function () {
	            return this.data.get('name') + ' - ' + this.data.get('email');
	        }
	    }
	});
```

计算数据的函数中只能使用 this.data.get 方法获取数据项的值，不能通过 this.method 调用组件方法，也不能通过 this.data.set 设置组件数据。


#### 过滤器

在定义视图模板时，插值是常用的展现数据的方式。在编写插值时，我们常使用 过滤器 将数据转换成适合视图展现的形式。

```
    {{createTime | dateFormat('yyyy-MM-dd')}}
```

San 针对常用场景，内置了几个过滤器：

* html - HTML 转义。当不指定过滤器时，默认使用此过滤器
* url - URL 转义
* raw - 不进行转义。当不想使用 HTML 转义时，使用此过滤器

定制过滤器

通过定义组件的 filters 成员，可以指定组件的视图模板可以使用哪些过滤器。

```
	san.defineComponent({
	    template: '<a>{{createTime | dateFormat("yyyy-MM-dd")}}</a>',

	    filters: {
	        dateFormat: function (value, format) {
	            return moment(value).format(format);
	        }
	    }
	});
```

#### 消息

通过 dispatch 方法，组件可以向组件树的上层派发消息。

```
    var SelectItem = san.defineComponent({
	    template: '<li on-click="select"><slot></slot></li>',

	    select: function () {
	        var value = this.data.get('value');

	        // 向组件树的上层派发消息
	        this.dispatch('UI:select-item-selected', value);
	    }
	});
```

消息将沿着组件树向上传递，直到遇到第一个处理该消息的组件，则停止。通过 messages 可以声明组件要处理的消息。

messages 是一个对象，key 是消息名称，value 是消息处理的函数，接收一个包含 target(派发消息的组件) 和 value(消息的值) 的参数对象。

```
	var Select = san.defineComponent({
	    template: '<ul><slot></slot></ul>',

	    // 声明组件要处理的消息
	    messages: {
	        'UI:select-item-selected': function (arg) {
	            var value = arg.value;
	            this.data.set('value', value);

	            // arg.target 可以拿到派发消息的组件
	        }
	    }
	});
```

