---
layout: post
title: "San学习笔记 四"
subtitle: "过渡"
date: 2018-1-11
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - San
---


最近关注了一个极简MVVM框架San，翻了一遍San的文档，做些笔记。
[中文文档](https://ecomfe.github.io/san/tutorial/start/)

----------

### 过渡
-------------

在元素上通过 s-transition 指令，可以声明过渡动画控制器。

```
    san.defineComponent({
	    template: '<div><button s-transition="opacityTransition">click</button></div>',

	    opacityTransition: {
	        // 过渡动画控制器
	        // ...
	    }
	});
```

s-transition 只能应用在具体的元素中。template 这种没有具体元素的标签上应用 s-transition 将没有效果。


#### 动画控制器

过渡动画控制器是一个包含 enter 和 leave 方法的对象。

enter 和 leave 方法的签名为 function({HTMLElement}el, {Function}done)。san 会把要过渡的元素传给过渡动画控制器，控制器在完成动画后调用 done 回调函数。

```
    san.defineComponent({
	    template: `
	        <div>
	            <button on-click="toggle">toggle</button>
	            <button s-if="isShow" s-transition="opacityTrans">Hello San!</button>
	            <button s-else s-transition="opacityTrans">Hello ER!</button>
	        </div>
	    `,

	    toggle: function () {
	        this.data.set('isShow', !this.data.get('isShow'));
	    },

	    opacityTrans: {
	        enter: function (el, done) {
	            var steps = 20;
	            var currentStep = 0;

	            function goStep() {
	                if (currentStep >= steps) {
	                    el.style.opacity = 1;
	                    done();
	                    return;
	                }

	                el.style.opacity = 1 / steps * currentStep++;
	                requestAnimationFrame(goStep);
	            }

	            goStep();
	        },

	        leave: function (el, done) {
	            var steps = 20;
	            var currentStep = 0;

	            function goStep() {
	                if (currentStep >= steps) {
	                    el.style.opacity = 0;
	                    done();
	                    return;
	                }

	                el.style.opacity = 1 - 1 / steps * currentStep++;
	                requestAnimationFrame(goStep);
	            }

	            goStep();
	        }
	    }
	});
```

san 把动画控制器留给应用方实现，框架本身不内置动画控制效果。应用方可以：

* 使用 css 动画，在 transitionend 或 animationend 事件监听中回调 done
* 使用 requestAnimationFrame 控制动画，完成后回调 done
* 在老旧浏览器使用 setTimeout / setInterval 控制动画，完成后回调 done
* 发挥想象力


过渡动画控制器 Creator调用支持传入参数

```
    san.defineComponent({
	    template: `
	        <div>
	            <button on-click="toggle">toggle</button>
	            <button on-click="toggleTrans">toggle transition</button>
	            <button s-if="isShow" s-transition="opacityTrans(noTransition)">Hello San!</button>
	            <button s-else s-transition="opacityTrans(noTransition)">Hello ER!</button>
	        </div>
	    `,

	    toggle: function () {
	        this.data.set('isShow', !this.data.get('isShow'));
	    },

	    toggleTrans: function () {
	        this.data.set('noTransition', !this.data.get('noTransition'));
	    },

	    initData: function () {
	        return {
	            noTransition: false
	        };
	    },

	    opacityTrans: function (disabled) {
	        return {
	            enter: function (el, done) {
	                if (disabled) {
	                    done();
	                    return;
	                }

	                var steps = 20;
	                var currentStep = 0;

	                function goStep() {
	                    if (currentStep >= steps) {
	                        el.style.opacity = 1;
	                        done();
	                        return;
	                    }

	                    el.style.opacity = 1 / steps * currentStep++;
	                    requestAnimationFrame(goStep);
	                }

	                goStep();
	            },

	            leave: function (el, done) {
	                if (disabled) {
	                    done();
	                    return;
	                }

	                var steps = 20;
	                var currentStep = 0;

	                function goStep() {
	                    if (currentStep >= steps) {
	                        el.style.opacity = 0;
	                        done();
	                        return;
	                    }

	                    el.style.opacity = 1 - 1 / steps * currentStep++;
	                    requestAnimationFrame(goStep);
	                }

	                goStep();
	            }
	        }
	    }
	});
```

