---
layout: post
title: "LeetCode刷题系列(1)(question 3)"
subtitle: "Longest Substring Without Repeating Characters"
date: 2017-12-20
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


### 题目号码：3（medium）
-------------


> **Longest Substring Without Repeating Characters:**
> Given a string, find the length of the longest substring without repeating characters.
> 
> **Examples:**
> - Given "abcabcbb", the answer is "abc", which the length is 3.
> - Given "bbbbb", the answer is "b", with the length of 1.
> - Given "pwwkew", the answer is "wke", with the length of 3.

#### 题意
返回给出字符串中最长且不含重复字母的子字符串的长度

-------------

#### 思路
从字符串开头开始分析，依次找到最长的不重复字母的子字符串存储下来，遍历结束后输出其长度。

#### 我的解法
```
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    var result = '';
    var data = '';
    for(let i=0; i<s.length; i++){
        if(data.indexOf(s.substr(i,1)) == -1){
            data += s.substr(i,1);
        }else{
            if(data.length > result.length){
                result = data;
            }
            data = data.substr(data.indexOf(s.substr(i,1))+1);
            data += s.substr(i,1);
        }
    }
    if(data.length > result.length){
        result = data;
    }
    return result.length;
};
```

-------------

#### 分析解法
```
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let map = Array(256).fill(-1) ,cur = 0, len = 0;
    for(let i=0;i<s.length;i++){
        let at = s[i].charCodeAt();
        let map_at = map[at];
        if(map_at !== -1){cur = map_at>cur?map_at:cur;}
        let tm_len = i-cur+1;
        len = len>tm_len?len:tm_len;
        map[at] = i+1;
    }
    return len;
};
```
##### 分析如下：

	1. 变量设置
		* map：一个256长度的数组，为字母对应的Unicode编码长度，存放每个字母出现的次数
		* cur：一个遍历中的变量，存储上一个相同字母点的位置
		* len：存储每次遍历中的最长字符串长度
		* tm_len：记录实时不重复子字符串的长度
	2. 开始遍历给定字符串的每个字符，首先根据这个字母的Unicode编码找到这个字母在map中对应的位置的值，
    如果这个值不为-1，说明这个字母不是第一次出现，去查找此字母的map位上的数值，
    对应最近一次出现此字母的位置，做减法，得到此时的不重复子字符串的长度，与历史最高长度len取最大值，直至遍历结束。
	3. 既然不需要返回此字符串，那么就应该将逻辑聚焦在长度上，通过数组合理存储最近一次的同字母位置来完成统计。