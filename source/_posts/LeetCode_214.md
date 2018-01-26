---
layout: post
title: "LeetCode刷题系列(2)(question 214)"
subtitle: "Shortest Palindrome"
date: 2017-12-26
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


### 题目号码：214（hard）
-------------


> **Shortest Palindrome:**
> Given a string S, you are allowed to convert it to a palindrome by adding characters in front of it. 
> Find and return the shortest palindrome you can find by performing this transformation.
> 
> **Examples:**
> - Given "aacecaaa", return "aaacecaaa".
> - Given "abcd", return "dcbabcd".

#### 题意
给定一个字符串S，可以通过在它前面添加字符将其转换为回文。通过执行这个转换，找到并返回最短的回文。

-------------

#### 思路
从字符串结尾开始遍历，与字符串开头对应位置的字母进行比较，如果不一致则插入一个相同的字母来形成回文

#### 我的解法
```
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    for(var i=s.length-1; i>=0; i--){
        if(s[i] !== s[s.length-1-i]){
            var s1 = s.substr(0,s.length-1-i);
            var s2 = s.substring(s.length-1-i);
            var ss = s[i];
            s = ''+s1+ss+s2;
            i++;
        }
    }
    return s;
};
```
##### 分析如下：

但是这种解法却没有通过测试，具体情况是：
    - 给出字符串 "aabba"
    - 我的输出结果为 "abbabba"
    - 期望输出结果为 "abbaabba"

乍一看仿佛是我的结果更准确，但是回过头仔细审题会发现题目中要求的是“在它前面添加字符”来形成回文，即我的解法思路是错的。
-------------

#### 思路
既然只能在给定字符串开头插入，那么就是说我需要找到给出字符串中自开头最大的回文子串，然后把剩下的字符串颠倒顺序插入即可。

#### 我的解法
```
/**
 * @param {string} s
 * @return {number}
 */
var findMaxIndex = function(s){
    for(var i=s.length-1; i>=0; i--){
        if(s[i] != s[s.length-1-i]){
            return false;
        }else{
            continue;
        }
    }
    return true;
}
var shortestPalindrome = function(s) {
    var index;
    if(s.length == 1){ return s; }
    for(var i=s.length; i>0; i--){
        var s0 = s.substring(0,i);
        if(!findMaxIndex(s0)){
            continue;
        }else{
            index = i;
            break;
        }
    }
    var s1 = s.substr(0,index);
    var s2 = s.substring(index);
    var ss = s2.split("").reverse().join("");
    return ss + s1 + s2;
};
```
##### 分析如下：

但是这种解法却没有通过测试，具体情况是：
    - 超时，给出一个超长的"aaaaaaa...aaa"字符串
这就要求我找到一个效率更高的解法。

#### 分析解法
```
/**
 * @param {string} s
 * @return {number}
 */
var shortestPalindrome = function(s) {
    var prefix = "";
    var pos, head, tail;

    for(pos = head = tail = parseInt(s.length / 2); pos > 0; head = tail = --pos){
        while(head !== 0 && s[head - 1] === s[head]){
            head--; pos--;
        }
        while(tail != s.length - 1 && s[tail + 1] === s[tail]){
            tail++;
        }
        var isSame = true;
        while(head >= 0){
            if(s[head] !== s[tail]){
                isSame = false;
                break;
            }
            head--; tail++;
        }
        if(isSame){
            break;
        }
    }

    for(var k = s.length - 1; k >= tail && k !== 0; k--){
        prefix += s[k];
    }
    return prefix + s;
}
```
##### 分析如下：

	1. 思路：
        * 取一个点，也就是期望的回文中心，把head和tail都指向它，先找前后相同的数，调整指针位置，然后head--, tail++这样找回文。
        * 如果head等于0，说明找到了，倒着输出tail后面的字符加上input的字符串就是答案。
        * 字符串中间和中间之前的点才有可能是回文的中心，后一半可以排除。
        * 回文中心可能是单个或多个字母，如果是多个字母，他们肯定都是相同的。
    2. 变量设置
		* prefix：用来存储原字符串中非回文部分的倒序
		* pos：回文中心点
		* head：回文头位置
		* tail：回文尾位置