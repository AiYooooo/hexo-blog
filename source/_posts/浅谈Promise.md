---
layout: post
title: "浅谈Promise和async function"
date: 2018-3-25
author: "Ai Shuangying"
tags:
	- ES6
---


最近看到一个问题，如下：

```
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}

console.log(i);
```

这个很简单，输出是 5 -> 5 5 5 5 5

这里主要涉及到 JS 中同步和异步代码的区别、变量作用域和定时器工作机制的内容。

-------------------------

那么如果我想要的输出是 5 -> 0 1 2 3 4呢？

第一个想法就是需要闭包，那么用箭头函数来处理

```
for (var i = 0; i < 5; i++) {
    ((i) => {
        setTimeout(function() {
            console.log(i);
        }, 1000);
    })(i) //声明立刻执行
}

console.log(i);
```

输出是 5 -> 0 1 2 3 4 没有问题

那么如果借助 JS 中基本类型的参数传递是按值传递的特征，就可以对上面的函数做个更优雅的处理

```
var output = function (i) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
};
for (var i = 0; i < 5; i++) {
    output(i);  //传入当时的值
}

console.log(i);
```

没有问题。

----------

那么如果我想要的输出是 0 -> 1 -> 2 -> 3 -> 4 -> 5 呢？

这个问题并不是单纯的想要隔一秒输出一个数，那样的话用粗暴的 1000 * i 的延迟也可以做到

这个问题其实可以理解为 几个任务按顺序做，一个做完做下一个，直至全部完成再执行循环外的函数

引入[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```
new Promise( function(resolve, reject) {...} /* executor */  );
```
executor是带有 resolve 和 reject 两个参数的函数 。

Promise构造函数执行时立即调用executor 函数， resolve 和 reject 两个函数作为参数传递给executor（executor 函数在Promise构造函数返回新建对象前被调用）。

resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。

executor 内部通常会执行一些异步操作，一旦完成，可以调用resolve函数来将promise状态改成fulfilled，或者在发生错误时将它的状态改为rejected。

如果在executor函数中抛出一个错误，那么该promise 状态为rejected。executor函数的返回值被忽略。



相关方法：

Promise.all(iterable)

    这个方法返回一个新的promise对象，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。

    这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。

    Promise.all方法常被用于处理多个promise对象的状态集合。

Promise.race(iterable)

    当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。

Promise.reject(reason)
    
    返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法

Promise.resolve(value)

    返回一个状态由给定value决定的Promise对象。

    如果该值是一个Promise对象，则直接返回该对象；

    如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。

    通常而言，如果你不知道一个值是否是Promise对象，使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用。

了解了这些，就可以着手改写上面的代码

```
const tasks = []; // 这里存放异步操作的 Promise
const output = (i) => new Promise((resolve) => {
    setTimeout(() => {
        console.log(i);
        resolve();
    }, 1000 * i);
});

// 生成全部的异步操作
for (var i = 0; i < 5; i++) {
    tasks.push(output(i));
}

// 异步操作完成之后，输出最后的 i
Promise.all(tasks).then(() => {
    setTimeout(() => {
        console.log(i);
    }, 1000);
});
```

完美。（当然这里没有处理 Promise 的 reject）

-----------------------------

尝试ES7 [async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
```
async function name([param[, param[, ... param]]]) { statements }
```
name            函数名称。
param           要传递给函数的参数的名称。
statements      函数体语句。

当调用一个 async 函数时，会返回一个 Promise 对象。

当这个 async 函数返回一个值时，Promise 的 resolve 方法会负责传递这个值；当 async 函数抛出异常时，Promise 的 reject 方法也会传递这个异常值。

async 函数中可能会有 await 表达式，这会使 async 函数暂停执行，等待表达式中的 Promise 解析完成后继续执行 async 函数并返回解决结果。

改写上面的代码

```
const sleep = (timeountMS) => new Promise((resolve) => {
    setTimeout(resolve, timeountMS);
});

(async () => {  // 声明即执行的 async 函数表达式
    for (var i = 0; i < 5; i++) {
        await sleep(1000);
        console.log(i);
    }

    await sleep(1000);
    console.log(i);
})();
```

问题解决。