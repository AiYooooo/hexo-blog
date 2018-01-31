---
layout: post
title: "San学习笔记 三"
subtitle: "插槽"
date: 2018-1-9
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - San
---


最近关注了一个极简MVVM框架San，翻了一遍San的文档，做些笔记。
[中文文档](https://ecomfe.github.io/san/tutorial/start/)

----------

### 插槽
-------------

在视图模板中可以通过 slot 声明一个插槽的位置，其位置的内容可以由外层组件定义。

```
    var Panel = san.defineComponent({
	    template: '<div>'
	        + '  <div class="head" on-click="toggle">title</div>'
	        + '  <p><slot></slot></p>'
	        + '</div>',

	    initData: function () {
	        return {name: 'Panel'};
	    }
	});

	var MyComponent = san.defineComponent({
	    components: {
	        'ui-panel': Panel
	    },

	    template: '<div><ui-panel>I am {{name}}</ui-panel></div>',

	    initData: function () {
	        return {name: 'MyComponent'};
	    }
	});

	/* MyComponent渲染结果
	<div>
	  <div class="head">title</div>
	  <p>I am MyComponent</p>
	</div>
	*/
```

可以看到，MyComponent组件中传入的信息插在了Panel组件提供的slot插槽中，并且其数据环境为 声明时的环境，即name取值为'MyComponent'

那么如果想要给组件的不同位置插入信息该怎么办呢？就需要对插槽进行命名。

一个视图模板的声明可以包含一个默认 slot 和多个命名 slot。外层组件的元素通过 slot="name" 的属性声明，可以指定自身的插入点。

```
    var Tab = san.defineComponent({
	    template: '<div>'
	        + '  <header><slot name="title"></slot></header>'
	        + '  <main><slot></slot></main>'
	        + '</div>'
	});

	var MyComponent = san.defineComponent({
	    components: {
	        'ui-tab': Tab
	    },

	    template: '<div><ui-tab>'
	        + '<h3 slot="title">1</h3><p>one</p>'
	        + '<h3 slot="title">2</h3><p>two<a slot="title">slot fail</a></p>'
	        + '</ui-tab></div>'
	});

	/* MyComponent渲染结果，a 元素无法被插入 title slot
	<div>
	  <header><h3>1</h3><h3>2</h3></header>
	  <main><p>one</p><p>two<a>slot fail</a></p></main>
	</div>
	*/
```

可见拥有title的slot属性的信息被插入到了组件的name=‘title’的插槽中，但是这里有个问题，那就是 外层组件的替换元素，只有在直接子元素上才能声明 slot="name" 指定自身的插入点。


在 slot 声明时应用 if 或 for 指令，可以让插槽根据组件数据动态化。

panel 的 hidden 属性为 true 时，panel 中默认插槽将不会渲染，仅包含 title 插槽，通过 slot 方法获取的数组长度为 0。

也就是说，传入panel的hidden属性为true，所以除了name="title"之外的slot都不会渲染，所以最终只出现了title部分，而desc部分没有渲染出来。

而for指令的用法类似if指令。

```
    var Panel = san.defineComponent({
	    template: '<div><slot name="title"/><slot s-if="!hidden"/></div>',
	});

	var MyComponent = san.defineComponent({
	    components: {
	      'x-panel': Panel
	    },

	    template: ''
	        + '<div>'
	          + '<x-panel hidden="{{folderHidden}}" s-ref="panel">'
	              + '<b slot="title">{{name}}</b>'
	              + '<p>{{desc}}</p>'
	          + '</x-panel>'
	        + '</div>',

	    attached: function () {
	        // 0
	        this.ref('panel').slot().length
	    }
	});


	var myComponent = new MyComponent({
	    data: {
	        folderHidden: true,
	        desc: 'MVVM component framework',
	        name: 'San'
	    }
	});

	/* MyComponent渲染结果，hidden为true所以不包含default slot
	<div>
	    <b>San</b>
	</div>
	*/
```


#### scoped 插槽

如果 slot 声明中包含 1 个以上 var- 数据前缀声明，该 slot 为 scoped slot。scoped slot 具有独立的 数据环境，其中仅包含 var- 声明的数据。scoped 数据声明的形式为 var-name=”expression”。

scoped slot 通常用于组件的视图部分期望由 外部传入视图结构，渲染过程使用组件内部数据。

但是在此例子中组件使用的数据依旧是外部传入的，有点混淆，其实是从MyComponent中定义了组件结构，并在对应的信息位置放置了变量，这些变量都将在Men组件内部来定义，组件中的p标签并没有意义，去除结果也是一样的，这里只是负责把数据定义出来就可以了

```
    var Men = san.defineComponent({
	    template: '<div>'
	      + '<slot s-for="item in data" var-n="item.name" var-email="item.email" var-sex="item.sex ? \'male\' : \'female\'">'
	        + '<p>{{n}},{{sex}},{{email}}</p>'
	      + '</slot>'
	      + '</div>'
	});

	var MyComponent = san.defineComponent({
	    components: {
	        'x-men': Men
	    },

	    template: '<div><x-men data="{{men}}" s-ref="men">'
	          + '<h3>{{n}}</h3>'
	          + '<p><b>{{sex}}</b><u>{{email}}</u></p>'
	        + '</x-men></div>',

	    attached: function () {
	        var slots = this.ref('men').slot();

	        // 3
	        slots.length

	        // truthy
	        slots[0].isInserted

	        // truthy
	        contentSlot.isScoped
	    }
	});

	var myComponent = new MyComponent({
	    data: {
	        men: [
	            {name: 'errorrik', sex: 1, email: 'errorrik@gmail.com'},
	            {name: 'leeight', sex: 0, email: 'leeight@gmail.com'},
	            {name: 'otakustay', email: 'otakustay@gmail.com', sex: 1}
	        ]
	    }
	});

	/* MyComponent渲染结果
	<div>
	    <h3>errorrik</h3>
	    <p><b>male</b><u>errorrik@gmail.com</u></p>
	    <h3>leeight</h3>
	    <p><b>female</b><u>leeight@gmail.com</u></p>
	    <h3>otakustay</h3>
	    <p><b>male</b><u>otakustay@gmail.com</u></p>
	</div>
	*/
```

scoped slot 中，除了可以访问 var- 声明的数据外，还可以访问当前环境的数据。

* 使用 slot 默认内容时，可以访问组件内部环境数据
* 外层组件定义的 slot 内容，可以访问外层组件环境的数据

```
    var Man = san.defineComponent({
	    template: '<p>'
	      +   '<slot var-n="who.name" var-email="who.email">'
	      +     '{{n}},{{email}},{{country}}'
	      +   '</slot>'
	      + '</p>'
	});

	var MyComponent = san.defineComponent({
	    components: {
	        'x-man': Man
	    },

	    template: ''
	        + '<div><x-man who="{{man}}" country="{{country}}">'
	        +   '<b>{{n}} - {{province}}</b>'
	        +   '<u>{{email}}</u>'
	        + '</x-man></div>'
	});

	var myComponent = new MyComponent({
	    data: {
	        man: {
	            name: 'errorrik', 
	            email: 'errorrik@gmail.com'
	        },
	        country: 'China',
	        province: 'HN'
	    }
	});

	/* MyComponent渲染结果
	<div>
	    <p>
	        <b>errorrik - HN</b>
	        <u>errorrik@gmail.com</u>
	    </p>
	</div>
	*/
```

这里组件中的n,province和email三个变量中province未在组件内部进行定义，所以可以取到父组件中定义的内容，即HN，但是如果稍加修改如下

```
	<slot var-n="who.name" var-email="who.email" var-province="who.province">
		'{{n}},{{email}},{{country}},{{province}}'

	man: {
        name: 'errorrik', 
        email: 'errorrik@gmail.com',
        province: 'CN'
    },
```

即在组件内部定义一个province变量，那么就可以覆盖掉父组件中的对应值，可见slot优先使用组件内部值


#### 动态命名
-------------

slot 声明中，组件可以使用当前的数据环境进行命名，从而提供动态的插槽。插槽的动态命名常用于 组件结构根据数据生成 的场景下，比如表格组件。

这里table组件中就进行了动态命名，当name=“col-name”时，父组件定义的b标签就会插入进去，从而实现在列表中加粗姓名的效果。

```
    var Table = san.defineComponent({
	    template: ''
	        + '<table>'
	        +   '<thead><tr><th s-for="col in columns">{{col.label}}</th></tr></thead>'
	        +   '<tbody>'
	        +     '<tr s-for="row in datasource">'
	        +       '<td s-for="col in columns">'
	        +         '<slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot>'
	        +       '</td>'
	        + '    </tr>'
	        +   '</tbody>'
	        + '</table>'
	});

	var MyComponent = san.defineComponent({
	    components: {
	        'x-table': Table
	    },

	    template: ''
	        + '<div>'
	        +   '<x-table columns="{{columns}}" datasource="{{list}}">'
	        +     '<b slot="col-name">{{row.name}}</b>'
	        +   '</x-table>'
	        + '</div>'

	});

	var myComponent = new MyComponent({
	    data: {
	        columns: [
	            {name: 'name', label: '名'},
	            {name: 'email', label: '邮'}
	        ],
	        list: [
	            {name: 'errorrik', email: 'errorrik@gmail.com'},
	            {name: 'leeight', email: 'leeight@gmail.com'}
	        ]
	    }
	});

	/* MyComponent渲染结果
	<div>
	    <table>
	        <thead>
	            <tr>
	                <th>名</th>
	                <th>邮</th>
	            </tr>
	        </thead>
	        <tbody>
	            <tr>
	                <td><b>errorrik</b></td>
	                <td>errorrik@gmail.com</td>
	            </tr>
	            <tr>
	                <td><b>leeight</b></td>
	                <td>leeight@gmail.com</td>
	            </tr>
	        </tbody>
	    </table>
	</div>
	*/
```

