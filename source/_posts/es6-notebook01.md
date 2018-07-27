---
layout: post
title: "ES6复习笔记(一)"
date: 2018-7-27
author: "Ai Shuangying"
tags:
	- ES6
---


最近不太忙，把阮一峰老师的[ES6入门](http://es6.ruanyifeng.com/)再看一遍，这次做些笔记。

看到哪里就把记不清的点记录下来，所以不会很连贯，初学者还是通读一遍比较好，欢迎购买实体书支持作者。

----------


### let 和 const
-------------

let 其实是ES6很重要的一个点，在于它引入了块的概念，在块级作用域中let和const声明的变量有一下几个点：

* 不存在变量提示，及声明之前调用会报错
* 同一个块级作用域内不能重复声明
* 声明的变量只在块级作用域内有效，不会污染外部变量
* 存在暂时性死区，及存在let的块级作用域在变量声明之前使用变量就会报错
* const保证的是变量指向的内存地址保存的数据不得变动，例外的是对象数组这类复合型数据，内存地址保存的是指针，所以这里变量不可赋值，但可以修改
* 声明的全局对象不再是顶层对象的属性

关于const

```
//可修改的对象属性
    const foo = {};
    // 为 foo 添加一个属性，可以成功
    foo.prop = 123;
    foo.prop // 得到123

    const a = [];
    a.push('Hello'); // 可执行
    a.length = 0;    // 可执行
    a = ['Dave'];    // 报错
```
真实的对象冻结
```
    const foo = Object.freeze({});

    // 常规模式时，下面一行不起作用；
    // 严格模式时，该行会报错
    foo.prop = 123;

    //将对象以及对象的属性彻底冻结的函数
    var constantize = (obj) => {
        Object.freeze(obj);
        Object.keys(obj).forEach( (key, i) => {
            if ( typeof obj[key] === 'object' ) {
                constantize( obj[key] );
            }
        });
    };
```

### 解构赋值
-------------

按照一定模式，从数组和对象中提取值，对变量进行赋值。其实就是一种模式匹配，等号两边模式相同则对位赋值


#### 数组的解构赋值
```
    let [foo, [[bar], baz]] = [1, [[2], 3]];

    let [head, ...tail] = [1, 2, 3, 4];

    //指定默认值的解构赋值
    let [x, y = 'b'] = ['a']; // x='a', y='b'
    //默认值只有在赋值对象严格等于undefined的情况下才会生效
    let [x = 1] = [undefined];  // x = 1
    let [x = 1] = [null];       // x = null

    function f() { console.log('aaa'); }
    let [x = f()] = [1];        // f() 不会执行

    let arr = [1, 2, 3];
    let {0 : first, [arr.length - 1] : last} = arr;     //方括号这种写法，属于“属性名表达式”
    first // 1
    last // 3
```

#### 对象的解构赋值
```
    let { foo, bar } = { foo: "aaa", bar: "bbb" };
    foo // "aaa"
    bar // "bbb"

    //如果变量名和属性名不一致，那么就要写成完整版的才能生效
    let obj = { first: 'hello', last: 'world' };
    let { first: f, last: l } = obj;
    f // 'hello'
    l // 'world'

    //也就是说第一种写法只是let { foo:foo, bar:bar } = { foo: "aaa", bar: "bbb" }的简写形式

    //嵌套结构
    const node = {
        loc: {
            start: {
                line: 1,
                column: 5
            }
        }
    };
    let { loc, loc: { start }, loc: { start: { line }} } = node;
    line // 1
    loc  // Object {start: Object}
    start // Object {line: 1, column: 5}

    //嵌套赋值
    let obj = {};
    let arr = [];
    ({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

    obj // {prop:123}
    arr // [true]
```
对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

//给已经声明的变量进行赋值要小心，不然会出现以下错误
```
    // 错误的写法
    let x;
    {x} = {x: 1};   // SyntaxError: syntax error
    //报错原因：JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

    // 正确的写法
    let x;
    ({x} = {x: 1});
```

#### 字符串的解构赋值
```
    const [a, b, c, d, e] = 'hello';    //此时字符串被转换成了一个类似数组的对象
    a // "h"
    b // "e"
    c // "l"
    d // "l"
    e // "o"

    let {length : len} = 'hello';
    len // 5
```

#### 解构赋值的用途
```
    //交换变量的值
    let x = 1;
    let y = 2;
    [x, y] = [y, x];

    //从函数返回多个值
    // 返回一个数组
    function example() {
        return [1, 2, 3];
    }
    let [a, b, c] = example();
    // 返回一个对象
    function example() {
        return {
            foo: 1,
            bar: 2
        };
    }
    let { foo, bar } = example();

    //提取JSON中的值
    let jsonData = {
        id: 42,
        status: "OK",
        data: [867, 5309]
    };
    let { id, status, data: number } = jsonData;

    //函数参数的默认值
    jQuery.ajax = function (url, {
        async = true,
        beforeSend = function () {},
        cache = true,
        complete = function () {},
        crossDomain = false,
        global = true
    } = {}) {
        // ... do stuff
    };
```
