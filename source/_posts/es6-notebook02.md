---
layout: post
title: "ES6复习笔记(二)"
date: 2018-8-3
author: "Ai Shuangying"
tags:
	- ES6
---


最近不太忙，把阮一峰老师的[ES6入门](http://es6.ruanyifeng.com/)再看一遍，这次做些笔记。

看到哪里就把记不清的点记录下来，所以不会很连贯，初学者还是通读一遍比较好，欢迎购买实体书支持作者。

----------


### 字符串的扩展
-------------

字符串匹配方法扩展

* indexOf：确定一个字符串是否包含在另一个字符串中
* includes：返回布尔值，表示是否找到了参数字符串
* startsWith：返回布尔值，表示参数字符串是否在原字符串的头部
* endsWith：返回布尔值，表示参数字符串是否在原字符串尾部

后三个新方法均支持第二个参数，表示搜索开始的位置。
endsWith的第二个参数意义不同，表示只针对前n个字符。
```
    let s = 'Hello world!';
    s.endsWith('Hello', 5) // true
```

repeat()方法
    返回一个新的字符串，表示将原字符串重复N次
```
    'hello'.repeat(2) // "hellohello"
```

字符串补全长度
    padStart()：头部补全
    padEnd()：尾部补全
```
    'x'.padStart(4, 'ab') // 'abax'
    'x'.padEnd(5, 'ab') // 'xabab'
```
    如果省略第二个参数则默认用空格补全

模板字符串
```
    let msg = `Hello, ${place}`;
```

### 数值的扩展
-------------

二进制和八进制数值的新的写法
```
    0b111110111 === 503 // true
    0o767 === 503 // true

    //转化为十进制
    Number('0o10')  // 8
```

新方法

* Number.isFinite()：用来检查一个数值是否为有限的（finite）
* Number.isNaN()：用来检查一个值是否为NaN
* Number.isInteger()：用来判断一个数值是否为整数
* 指数运算符 **  // 2 ** 2 === 4
    方法变动

    全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。
    ```
        Number.parseInt('12.34') // 12
        Number.parseFloat('123.45#') // 123.45
    ```
    通过这种方式减少全局方法，逐步模块化

新的常量

    Number.EPSILON：实质是一个可以接受的最小误差范围
        解决： 0.1+0.2 === 0.3 // false的问题
```
    function withinErrorMargin (left, right) {
        return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
    }

    0.1 + 0.2 === 0.3 // false
    withinErrorMargin(0.1 + 0.2, 0.3) // true

    1.1 + 1.3 === 2.4 // false
    withinErrorMargin(1.1 + 1.3, 2.4) // true
```

    Number.MAX_SAFE_INTEGER 、 Number.MIN_SAFE_INTEGER：规定能够准确表示的整数范围
```
    Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1     // true
    Number.MAX_SAFE_INTEGER === 9007199254740991        // true

    Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER    // true
    Number.MIN_SAFE_INTEGER === -9007199254740991           // true
```
    Number.isSafeInteger():用来判断一个整数是否落在这个范围之内

Math 对象的扩展

* Math.trunc()：用于去除一个数的小数部分，返回整数部分。
* Math.sign()：用来判断一个数到底是正数、负数、还是零。返回值有5个：+1,-1,0,-0,NaN
* Math.cbrt()：用于计算一个数的立方根。
* Math.clz32()：返回一个数的 32 位无符号整数形式有多少个前导 0
* Math.imul()：返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数
* Math.fround()：返回一个数的32位单精度浮点数形式
* Math.hypot()：返回所有参数的平方和的平方根。
* Math.expm1(x)：返回 ex - 1，即Math.exp(x) - 1
* Math.log1p(x)：方法返回1 + x的自然对数，即Math.log(1 + x)
* Math.log10(x)：返回以 10 为底的x的对数
* Math.log2(x)：返回以 2 为底的x的对数
* Math.sinh(x)：返回x的双曲正弦（hyperbolic sine）
* Math.cosh(x)：返回x的双曲余弦（hyperbolic cosine）
* Math.tanh(x)：返回x的双曲正切（hyperbolic tangent）
* Math.asinh(x)：返回x的反双曲正弦（inverse hyperbolic sine）
* Math.acosh(x)：返回x的反双曲余弦（inverse hyperbolic cosine）
* Math.atanh(x)：返回x的反双曲正切（inverse hyperbolic tangent）