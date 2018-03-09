---
layout: post
title: "LeetCode刷题系列(3)(question 65)"
subtitle: "Valid Number"
date: 2018-1-25
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- LeetCode
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


这个系列将记载我在[LeetCode](https://leetcode.com)上遇见的有意思、有难度或者有其他精彩答案的题目。
所用语言为JavaScript。

----------


### 题目号码：65（hard）
-------------


> **Validate if a given string is numeric.**
> It is intended for the problem statement to be ambiguous. You should gather all requirements up front before implementing one.
> 
> **Examples:**
> - "0" => true
> - " 0.1 " => true
> - "abc" => false
> - "1 a" => false
> - "2e10" => true

#### 题意
判断给出的字符串是否可以转成合法数字

-------------

#### 思路
从题目看来，切入点应该就在对给定字符串的筛选上，同时考虑有科学计数法的提现

-------------

#### 分析解法
```
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function(s) {
    if (s === "") return false;
    for (var i = 0; i < s.length; i++) {
        if (s.charAt(i) != " ") break;
    }
    if (i == s.length) return false;
    return !isNaN(Number(s.substring(i)));
};
```

##### 分析如下：

	1. 首先，判断是空字符串，直接返回false，避免影响后面的判断。
	2. 通过逐字判断，若是字符串中全是空格符，返回false。
	3. 既然不全是空格，那就截取第一个非空格到结尾的字符串然后通过Number()函数转化成数字，如果不是NaN就返回true。
    解决。

