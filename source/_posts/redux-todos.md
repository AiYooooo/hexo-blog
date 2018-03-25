---
layout: post
title: "Redux-todos代码分析"
subtitle: "官网示例todos"
date: 2018-2-21
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- Redux
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


Redux官方示例代码中给了一些examples，我将逐一进行学习，并记录下来，加深对redux的理解。

[官方地址](https://github.com/reactjs/redux/tree/master/examples/todos)

----------


#### 目录结构
-------------

```
	---public
		-index.html
	---src
		---actions
			-index.js
		---components
			-App.js
			-Footer.js
			-Link.js
			-Todo.js
			-TodoList.js
		---containers
			-AddTodo.js
			-FilterLink.js
			-VisibleTodoList.js
		---reducers
			-index.js
			-todos.js
			-visibilityFilter.js
		-index.js

```


#### 项目入口
-------------

/public/index.html

作为静态文件模板，这个文件主要就是提供一个入口，将React代码生成的视图插入进去

```
	<div id="root"></div>
```

/src/index.js

```
	import React from 'react'
	import { render } from 'react-dom'
	import { createStore } from 'redux'
	import { Provider } from 'react-redux'
	import App from './components/App'
	import rootReducer from './reducers'

	const store = createStore(rootReducer)

	render(
  		<Provider store={store}>
    		<App />
  		</Provider>,
  		document.getElementById('root')
	)
```

这是个典型的React入口函数，将根组件 <App /> 插入到html模板的 id为root的插槽中。

这里的createStore则是Redux内置的方法，用来创建一个全局唯一的store，并传入根reducer来做配置。

Provider在根组件外面包了一层，这样一来，App的所有子组件就默认都可以拿到state了。

这个项目的state为：

```
	{
		todos:[
			completed: true,
			id: 0,
			text: 'Learn about actions'
		],
		visibleTodoFilter: "SHOW_ALL"
	}
```

下面按顺序查看代码。


#### reducers
-------------

/src/reducers/index.js

```
	import { combineReducers } from 'redux'
	import todos from './todos'
	import visibilityFilter from './visibilityFilter'

	export default combineReducers({
  		todos,
  		visibilityFilter
	})
```

combineReducers() 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象。

这个写法等同于下面的写法：

```
	export default function todoApp(state = {}, action) {
  		return {
    		visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    		todos: todos(state.todos, action)
  		}
	}
```

但是第一种写法是如何识别key并绑定的呢？？？此处存疑。

接着看导入的两个reducer

```
	const visibilityFilter = (state = 'SHOW_ALL', action) => {
  		switch (action.type) { 
    		case 'SET_VISIBILITY_FILTER':
      			return action.filter
    	default:
      		return state
  		}
	}

	export default visibilityFilter
```

这个reducer的操作就是根据改变筛选条件来返回新的state

```
	const todos = (state = [], action) => {
  		switch (action.type) {
    		case 'ADD_TODO':
     	 		return [
        			...state,
			        {
			          	id: action.id,
			          	text: action.text,
			          	completed: false
			        }
      			]
    		case 'TOGGLE_TODO':
      			return state.map(todo =>
        			(todo.id === action.id)
          			? {...todo, completed: !todo.completed}
          			: todo
      			)
   		 	default:
      			return state
  		}
	}

	export default todos
```

ADD_TODO动作中，采用数组合并，添加一个新的待操作项，创建一个新的state的todos数组并返回

而TODDLE_TODO动作中，则是对当前state进行遍历，查到id相同项，取反completed属性并返回

这两个reducer对应了todos这个应用的三个用户会触发的事件，都做了对应action的处理，接下来进行绑定action


#### components

这个文件夹对应的含义是不含逻辑的组件，只接受props传值然后负责渲染

/components/App.js

```
	import React from 'react'
	import Footer from './Footer'
	import AddTodo from '../containers/AddTodo'
	import VisibleTodoList from '../containers/VisibleTodoList'

	const App = () => (
  		<div>
    		<AddTodo />
    		<VisibleTodoList />
    		<Footer />
  		</div>
	)

	export default App
```

这个就是根组件，下面以此来看这三个子组件

/components/Footer.js

```
	import React from 'react'
	import FilterLink from '../containers/FilterLink'
	import { VisibilityFilters } from '../actions'

	const Footer = () => (
  		<div>
		    <span>Show: </span>
		    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
      			All
		    </FilterLink>
		    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
      			Active
		    </FilterLink>
		    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
      			Completed
    		</FilterLink>
  		</div>
	)

	export default Footer
```

这里用了一个逻辑组件 <FilterLink />来包裹按钮，同时传入了属性filter，先来看下actions里的VisibilityFilters

/actions/index.js

```
	let nextTodoId = 0
	export const addTodo = text => ({
	  	type: 'ADD_TODO',
	  	id: nextTodoId++,
	  	text
	})

	export const setVisibilityFilter = filter => ({
  		type: 'SET_VISIBILITY_FILTER',
  		filter
	})

	export const toggleTodo = id => ({
  		type: 'TOGGLE_TODO',
  		id
	})

	export const VisibilityFilters = {
  		SHOW_ALL: 'SHOW_ALL',
  		SHOW_COMPLETED: 'SHOW_COMPLETED',
  		SHOW_ACTIVE: 'SHOW_ACTIVE'
	}
```

我们知道actions存放的是动作的描述，那么VisibilityFilters的三个对应属性分别传入 <FilterLink />中，不出意外这个组件里就将绑定action SET_VISIBILITY_FILTER和对应的 reducer了。

/containers/FilterLink.js

```
	import { connect } from 'react-redux'
	import { setVisibilityFilter } from '../actions'
	import Link from '../components/Link'

	const mapStateToProps = (state, ownProps) => ({
  		active: ownProps.filter === state.visibilityFilter
	})

	const mapDispatchToProps = (dispatch, ownProps) => ({
  		onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
	})

	export default connect(
  		mapStateToProps,
  		mapDispatchToProps
	)(Link)
```

这里的FilterLink组件使用 connect方法生成的，用于从 UI 组件生成容器组件。connect的意思，就是将这两种组件连起来。

Link就是UI组件，而生成的FilterLink就是容器组件，Link只负责单纯的数据渲染，所有的逻辑都将在FilterLink组件里完成。

这里的绑定的逻辑就有两部分组成：

一是输入逻辑，即mapStateToProps，可以理解为state转化为组件pros的逻辑，这里是将state的visibilityFilter属性赋值给props的filter属性，用来影响Link组件中button的可点击状态。

而是输出逻辑，即mapDispatchToProps，可以理解为动作的发生逻辑，这里绑定了个点击事件，点击的逻辑是派发一个setVisibilityFilter动作，会由actions接收，参数就是当前组件的filter属性。

/components/Link.js

```
	import React from 'react'
	import PropTypes from 'prop-types'

	const Link = ({ active, children, onClick }) => (
    	<button
	       onClick={onClick}
	       disabled={active}
	       style={{ marginLeft: '4px', }}
	    >
      		{children}
    	</button>
	)

	Link.propTypes = {
	  	active: PropTypes.bool.isRequired,
	  	children: PropTypes.node.isRequired,
	  	onClick: PropTypes.func.isRequired
	}

	export default Link
```

/containers/AddTodo.js

```
	import React from 'react'
	import { connect } from 'react-redux'
	import { addTodo } from '../actions'

	const AddTodo = ({ dispatch }) => {
  		let input

  		return (
    		<div>
      			<form onSubmit={e => {
        			e.preventDefault()
        			if (!input.value.trim()) {
          				return
        			}
        			dispatch(addTodo(input.value))
        			input.value = ''
      			}}>
        			<input ref={node => input = node} />
        			<button type="submit">
          				Add Todo
        			</button>
      			</form>
    		</div>
  		)
	}

	export default connect()(AddTodo)
```

这个组件就很简单了，就是一个表单，点击提交时派发一个addTodo动作等待被actions接受就可以了，参数为添加的事项名称，id会在actions里面动态添加。

/containers/VisibleTodoList.js

```
	import { connect } from 'react-redux'
	import { toggleTodo } from '../actions'
	import TodoList from '../components/TodoList'

	const getVisibleTodos = (todos, filter) => {
  		switch (filter) {
    		case 'SHOW_ALL':
      			return todos
    		case 'SHOW_COMPLETED':
      			return todos.filter(t => t.completed)
    		case 'SHOW_ACTIVE':
      			return todos.filter(t => !t.completed)
    		default:
      			throw new Error('Unknown filter: ' + filter)
  		}
	}

	const mapStateToProps = state => ({
	  	todos: getVisibleTodos(state.todos, state.visibilityFilter)
	})

	const mapDispatchToProps = dispatch => ({
	  	toggleTodo: id => dispatch(toggleTodo(id))
	})

	export default connect(
	  	mapStateToProps,
	  	mapDispatchToProps
	)(TodoList)
```

这个组件与Footer类似

输入逻辑是根据filter的值来决定todos数组中那些项显示出来

输出逻辑则是点击列表项时派发一个toggleTodo动作，参数是这个列表项的id

/components/TodoList.js

```
	import React from 'react'
	import PropTypes from 'prop-types'
	import Todo from './Todo'

	const TodoList = ({ todos, toggleTodo }) => (
  		<ul>
    		{todos.map(todo =>
      			<Todo
        			key={todo.id}
        			{...todo}
        			onClick={() => toggleTodo(todo.id)}
      				/>
    		)}
  		</ul>
	)

	TodoList.propTypes = {
 		todos: PropTypes.arrayOf(PropTypes.shape({
    		id: PropTypes.number.isRequired,
    		completed: PropTypes.bool.isRequired,
    		text: PropTypes.string.isRequired
  		}).isRequired).isRequired,
  		toggleTodo: PropTypes.func.isRequired
	}

	export default TodoList
```

/components/Todo.js

```
	import React from 'react'
	import PropTypes from 'prop-types'

	const Todo = ({ onClick, completed, text }) => (
  		<li
   	 		onClick={onClick}
    		style={{ textDecoration: completed ? 'line-through' : 'none' }}
  			>
    		{text}
  		</li>
	)

	Todo.propTypes = {
  		onClick: PropTypes.func.isRequired,
  		completed: PropTypes.bool.isRequired,
  		text: PropTypes.string.isRequired
	}

	export default Todo
```

这两个组件就是单纯的UI组件，将todos的数据渲染出来，并为每个todo绑定一个点击事件，用来派发toggleTodo动作。



#### 总结

通过对整个项目的分析，可以明显得感觉到，Redux通过将actions抽离并合并，将各种情况下的动作集合在一起统一管理，并通过reducer为这些动作添加逻辑，达到修改store的目的，从而渲染新的UI，等待用户操作，这样就形成了一个数据的单向闭环流动，使得每一个动作都可预测。