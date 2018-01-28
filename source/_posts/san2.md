---
layout: post
title: "San学习笔记 二"
subtitle: "事件处理及表单提交"
date: 2018-1-6
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - San
---


最近关注了一个极简MVVM框架San，翻了一遍San的文档，做些笔记。
[中文文档](https://ecomfe.github.io/san/tutorial/start/)

----------

### 事件处理
-------------

通过 on- 前缀，可以将事件的处理绑定到组件的方法上，无论是 DOM 事件还是组件的自定义事件，都通过 on- 前缀绑定，没有语法区分。

on- + 事件名 将 DOM 元素的事件绑定到组件方法上。当 DOM 事件触发时，组件方法将被调用，this 指向组件实例。

```
    san.defineComponent({
	    template: '
	    	<ul>
			    <li s-for="item, index in todos">
			        <h3>{{ item.title }}</h3>
			        <p>{{ item.desc }}</p>
			        <i class="fa fa-trash-o" on-click="rmTodo(item)"></i>
			    </li>
			</ul>',

	    rmTodo: function (todo) {
	        service.rmTodo(todo.id);
	        this.data.remove('todos', todo);
	    }
	});
```

$event 是 San 保留的一个特殊变量，指定 $event 将引用到 DOM Event 对象。从而你可以拿到事件触发的 DOM 对象、鼠标事件的鼠标位置等事件信息。

```
	san.defineComponent({
	    template: '<button type="button" on-click="clicker($event)">click here</button>',

	    clicker: function (e) {
	        alert(e.target.tagName); // BUTTON
	    }
	});
```


自定义事件的绑定

```
	//定义一个Label组件，此组件会通过调用 fire 方法来派发一个事件
	var Label = san.defineComponent({
	    template: '<template class="ui-label" title="{{text}}">{{text}}</template>',

	    attached: function () {
	        this.fire('done', this.data.get('text') + ' done');
	    }
	});

	var MyComponent = san.defineComponent({
    	components: {
	        'ui-label': Label  	//这里引入自定义组件Label
	    },

	    template: '<div><ui-label bind-text="name" on-done="labelDone($event)"></ui-label></div>',
	    //这里绑定了text为字符串name，绑定了done事件

	    labelDone: function (doneMsg) {
	        alert(doneMsg);	//组件自身的done事件会派发一个事件，发出一个字符串
	    }
	});	
```



#### 修饰符

在元素的事件声明中使用 capture 修饰符，事件将被绑定到捕获阶段。

```
    var MyComponent = san.defineComponent({
	    template: ''
	        + '<div on-click="capture:mainClick">'
	            + '<button on-click="capture:btnClick">click</button>'
	        + '</div>',

	    mainClick: function (title) {
	        alert('Main');
	    },

	    btnClick: function (title) {
	        alert('Button');
	    }
	});
	// 会先触发mainClick事件再触发btnClick事件，因为是按点击事件的捕获顺序执行的
```

在组件的事件声明中使用 native 修饰符，事件将被绑定到组件根元素的 DOM 事件。

```
    var Button = san.defineComponent({
	    template: '<a class="my-button"><slot/></a>'
	});

	var MyComponent = san.defineComponent({
	    components: {
	        'ui-button': Button
	    },

	    template: '<div><ui-button on-click="native:clicker(title)">{{title}}</ui-button></div>',

	    initData: function () {
            return {
                title: 'San'
            };
        },

	    clicker: function (title) {
	        alert(title);
	    }
	});
	//点击会显示：San
```


#### 表单
-------------

输入框的绑定方法比较简单，直接对输入框的 value 属性应用双向绑定就行了。

```
    <input type="text" value="{= name =}">
```

checkbox

checkbox 常见的使用场景是分组，在组件模板中，我们把需要分组的 checkbox 将 checked 属性双向绑定到同名的组件数据中。

我们期望 checkbox 绑定到的数据项是一个 Array<string> 。当 checkbox 被选中时，其 value 会被添加到绑定的数据项中；当 checkbox 被取消选中时，其 value 会从绑定数据项中移除。

```
    san.defineComponent({
	    template: '<div>
		    <label><input type="checkbox" on-click="chooseone" value="errorrik" checked="{= online =}">errorrik</label>
		    <label><input type="checkbox" on-click="chooseone" value="otakustay" checked="{= online =}">otakustay</label>
		    <label><input type="checkbox" on-click="chooseone" value="firede" checked="{= online =}">firede</label>
		</div>',

	    initData: function () {
	        return {
	            online: []
	        };
	    },

	    chooseone: function () {
            console.log(this.data.get('online'));
        },

	    attached: function () {
	        this.data.set('online', ['errorrik', 'otakustay']);
	    }
	});
```

radio

与 checkbox 类似，我们在组件模板中，把需要分组的 radio 将 checked 属性绑定到同名的组件数据中。

你需要手工指定分组 radio 的 name 属性，使浏览器能处理 radio 选择的互斥。可以把它设置成与绑定数据的名称相同。

我们期望 radio 绑定到的数据项是一个 string 。当 radio 被选中时，绑定的数据项值被设置成选中的 radio 的 value 属性值。

```
    san.defineComponent({
	    template: '<div>
		    <label><input type="radio" on-click="chooseone" value="errorrik"  checked="{= online =}" name="online">errorrik</label>
		    <label><input type="radio" on-click="chooseone" value="otakustay" checked="{= online =}" name="online">otakustay</label>
		    <label><input type="radio" on-click="chooseone" value="firede"    checked="{= online =}" name="online">firede</label>
		</div>',

	    initData: function () {
	        return {
	            online: 'errorrik'
	        };
	    },

	    chooseone: function () {
            console.log(this.data.get('online'));
        },
	});
```

select

select 的使用方式和输入框类似，直接对 value 属性应用双向绑定。

在浏览器中，select 的 value 属性并不控制其选中项，select 的选中项是由 option 的 selected 属性控制的。考虑到开发的方便，开发者不需要编写 option 的 selected 属性，San 会在下一个视图更新时间片中刷新 select 的选中状态。

```
    san.defineComponent({
	    template: '<select value="{= online =}" on-change="chooseone">
		    <option value="errorrik">errorrik</option>
		    <option value="otakustay">otakustay</option>
		    <option value="firede">firede</option>
		</select>',

	    initData: function () {
	        return {
	            online: 'errorrik'
	        };
	    },

	    chooseone: function () {
            console.log(this.data.get('online'));
        },
	});
```