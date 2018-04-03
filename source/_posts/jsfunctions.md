---
layout: post
title: "常见JS方法总结"
subtitle: "去重、对象处理"
date: 2018-3-5
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- JavaScript
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


记录下常用到的JS小方法，积累多了可以维护自己的方法库。

----------


#### 去重
-------------

数组基本类型去重

```
    function unique(arr) {
        return arr.filter(function (element, index) {
            return arr.indexOf(element) === index;
        });
    }
```

这里思维很简单，通过indexOf方法返回第一个匹配值的下标去当前值下标进行对比就可以知道是否是第一次出现。

如果是字符串去重可以使用 .split('') 方法转成数组处理，处理完后使用 .join() 方法来重新组合成字符串即可。

可以使用Array.isArray()来预先做个判断，看是否是合法数组。

复杂类型去重

```
    function unique(arr) {
        var hash = {};
        return arr.filter(function (element) {
            if (hash.hasOwnProperty(element)) {
                return false;
            }
            hash[element] = true;
            return true;
        });
    }
```

#### 对象处理
-------------

```
    function jsonResultGenerator(obj) {
        var result = [];
        Object.keys(obj).forEach(function (key) {
            result.push({ type: key, contents: obj[key] });
        });
        return result;
    }
```

obj是一个形如{type1: contentsArr1, type2: contentsArr2}的结构，调整为[{type:type1,contents:contentsArr1},{type:type2,contents:contentsArr2}]的结构，那么只需要外面包一层就可以了，通过Object.keys(obj).forEach()来取出每个type，然后根据type取出array填入就可以了。

下面看判断纯对象

```
    function isPureObject(item) {
        return Object.prototype.toString.call(item).slice(8, -1) === 'Object';
    }
```

Object.prototype.toString.call(item)返回的是item类型对应的'[object Null]'形式的字符串，.slice(8, -1)取的就是item的对象类型

