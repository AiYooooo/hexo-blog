---
layout: post
title: "Redux学习笔记"
subtitle: "记录下学习redux过程中的要点"
date: 2018-2-20
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- Redux
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


Redux 是 JavaScript 状态容器，提供可预测化的状态管理。因为最近开始系统得学习React，而Redux常被用作React的数据管理器，所以一并学习。

这篇博客（或者还有几篇）主要用来记录在学习过程中难以理解的点和值得记住的问题，随时补充，以备查阅。

----------


#### 安装
-------------

```
	npm install --save redux

	npm install --save react-redux
```


-------------

#### 核心思想

Redux是一个单向数据流管理器，也就是说在整个项目的逻辑中，数据的流动是单向的，每个操作的后果都可预测，这就使得在大型项目开发中的数据管理变得简单（虽然对于很多小项目的结构会复杂很多，比如todolist，这也就是为什么有句话叫“如果你不确定需要Redux，那你就是不需要它”）

每个Redux都一个唯一的store，用来管理所有呈现呈现出来的数据状态，包含 state和 reducers。

而用户的每个行为只能通过触发action来影响store从而呈现出来（比如改变state）

所以，redux的三大原则就可以理解了：

* 单一数据源
	整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中
* state是只读的
	唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象
* 使用纯函数来执行修改
	也就是reducer函数应该是一个 (state, action) => state 的纯函数




#### Store

全局唯一的store用来管理应用状态。

当需要拆分数据处理逻辑时，你应该使用 reducer 组合 而不是创建多个 store。

```
	import { createStore } from 'redux';

	let store = createStore(counter);

	store.dispatch({ type: 'INCREMENT' });

	console.log(store.getState()) //就可以输出当前的应用的所有state情况

	const unsubscribe = store.subscribe(() =>
  		console.log(store.getState())
	)	//监听 每次state更新时，打印日志

	unsubscribe(); //注销监听器
```

在这里的state是只读的。这样确保了视图和网络请求都不能直接修改 state，相反它们只能表达想要修改的意图。

而这些意图都会被抽象成一个action集中化处理。

发布一个事件是唯一改变内部state的方法，而action则可用于序列化来呈现使用过程。

为了描述 action 改变 state tree 的过程，需要编写reducers，也就是action的处理逻辑。


#### Reducer

来看reducer，它的形式为 (state, action) => state 的纯函数，也就是 state 变化的逻辑所在，描述了action怎么把旧状态改变为新状态，而reducer返回的形式必须要和state形式一致，这很好理解，reducer的任务就是得到新state

```
	function counter(state = 0, action) {
	  	switch (action.type) {
		  	case 'INCREMENT':
		    	return state + 1;
		  	case 'DECREMENT':
		    	return state - 1;
		  	default:
		    	return state;
	  	}
	}
```

这是一个简单的reducer，传入一个旧的状态（初始值为0），然后根据行为action来进行不同的操作，然后返回新的状态。

使用reducer时应该注意：

* 不要修改传入参数
* 不要执行有副作用得操作，比如API请求或路由跳转等
* 不要调用非纯函数，比如 Date.now() 或 Math.random() 等等

reducer一定要保持纯净


#### action

action描述的是一种事件，可能由用户操作产生，或者由服务器响应等等，它的意义就是描述数据的变化原因，也是store数据的唯一来源

可以通过 atore.dispatch() 将action传到store中。

action实际上就是一个JS普通对象，它的意义是我们赋予的，从而约定 action里面必须有一个字符串类型的type字段来表示将要执行的动作，例如

```
	{
  		type: ADD_TODO,
  		text: 'Build my first Redux app'
	}
```

这个是action，它表示一个行为，而下面的函数是：action创建函数，它是生成action的方法，它只是简单得返回一个action。

```
	export const addTodo = (text) => ({
  		type: 'ADD_TODO',
  		id: nextTodoId++,
  		text
	})
```

应该尽量减少在 action 中传递的数据


#### 数据流

严格的单向数据流是 Redux 架构的设计核心。

Redux应用中数据得生命周期遵循以下4个步骤：

1. 调用store.dispatch(action) ，可以在任何地方调用，触发一个事件
2. Redux store调用传入的reducer函数，把 当前的state tree 和 action 作为参数传入，来处理这个action
3. 根reducer应该把多个子reducer输出合并成一个单一的state tree
4. Redux store保存了根reducer返回的完整 state tree


掌握了这些基本知识，接下来分析下官方提供的最简单的todolist应用，来梳理Redux的设计思路和使用流程。