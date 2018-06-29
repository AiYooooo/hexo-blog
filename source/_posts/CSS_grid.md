---
layout: post
title: "CSS grid(网格)"
date: 2018-6-25
author: "Ai Shuangying"
tags:
	- CSS
---


很久没有更新了，今天难得清闲，浏览了一些前端博客，发现了CSS grid布局，有点意思，记录下来。

----------


#### CSS Grid 的出现，网格变得更加简单
-------------

```
//先给定一个HTML结构

<div class="grid">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
</div>

//来尝试一个最简单的grid布局
.grid {
    display: grid;
    height: 100px;
    grid-template-columns: 100px 100px 100px 100px;
    grid-column-gap: 20px;
}
.item {
    background-color: #999;
}
```

效果怎么样呢？

![最简单的grid布局](https://download.chatchat.online/aiblogimgs/css_grid_01.png)

可以看到容器里面四个元素都具有了定宽，元素间距也设置好了。

是不是很简单，效果也不错吧（现有的实现方式也可以用flex布局来完成，但不够灵活）
 
也就是说，想要创建几个网格就给 grid-template-columns 添加多少值，同时支持每个网格不同的宽度设置。


#### 让网格具有响应性
-------------

划重点：这里引入一个单位：fr

fr 是代表一个片段的灵活长度单位。当你使用 fr 单位时，浏览器会分割开放空间并根据 fr 倍数将区域分配给列。这意味着要创建四个相同大小的列，你需要写四次 1fr。

```
.grid {
    display: grid;
    height: 100px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
}
.item {
    background-color: #999;
}
```

效果如下：

![响应网格](https://download.chatchat.online/aiblogimgs/css_grid_02.png)

可以看到四个元素均匀充满了空间，间距依旧是设定好的20px，很不错。

但是这种方式可以保证四个元素始终等宽么？？？

no

使用 fr 单元创建的网格并不总是相等的！

当你使用 fr 时，你需要知道每个 fr 单位是可用（或剩余）空间的一个小片段。

如果你的元素比使用 fr 单位创建的任何列都要宽，则需要以不同的方式进行计算。

举个例子：

我们在第一个元素里添加一个定宽的元素（一个200px的红色方块），再看看效果

![特殊不均分网格](https://download.chatchat.online/aiblogimgs/css_grid_03.png)

see? 这样我们就明白了fr的工作原理： 按照权重分配剩余宽度

（在这里，父元素宽700，正常情况下fr均分等宽为 (700-60)/4 ，可是不够200怎么办呢？那么第一个item宽度就是200，剩下三个均分 就是 (500-60)/3 ），GET！


###### 关于不等宽网格
-------------

只需更改 fr 倍数，就可以创建宽度不等的网格。

```
.grid {
    display: grid;
    height: 100px;
    grid-template-columns: 1fr 1.618fr 2.618fr;
    grid-column-gap: 20px;
}
.item {
    background-color: #999;
}
```

![不等宽网格](https://download.chatchat.online/aiblogimgs/css_grid_04.png)

这很好理解。

###### 配合媒体查询
-------------

为了更灵活得网页设计，可以将grid与媒体查询结合起来

```
.grid {
    display: grid;
    height: 100px;
    grid-template-columns: 1fr 1.618fr 2.618fr;
    grid-column-gap: 20px;
}
@media (min-width: 30em) {
    .grid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}
```


#### 根据高度来划分网格
-------------

这里就要用到 vh 这个单位，这个常用，不多介绍

看个例子

```
.grid {
    display: grid;
    height: 100%;
    grid-template-rows: 1fr 1fr 1fr 1fr; 
    grid-auto-columns: calc((100% - 3em) / 4);
    grid-auto-flow: column;
    grid-gap: 1em;
}
```
![按高度划分的网格](https://download.chatchat.online/aiblogimgs/css_grid_05.png)

很简单吧。


#### 灵活的防止网格
-------------

那么再来看一个问题：

加入我只有一个item，但是我希望父元素分成四个网格，我的item放在第二个里面，其余留空，如何处理？？

```
<div class="grid">
    <div class="item"></div>
</div>

.grid {
    display: grid;
    width: 100%;
    height: 100px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
}
.item {
    background-color: #999;
    grid-column: 2;
}
```
![放置网格](https://download.chatchat.online/aiblogimgs/css_grid_06.png)

甚至还可以 通过 span 关键字来设置覆盖多少列，看个例子

```
.item {
    background-color: #999;
    grid-column: 2 / span 2;
}
```
![放置网格](https://download.chatchat.online/aiblogimgs/css_grid_07.png)

这里注意 网格填充空间也会被一并填充进去。


#### 末尾
-----------------

推荐  [Jen Simmon的实验室](http://labs.jensimmons.com/)
