---
layout: post
title: "Node.js系列(mongoose的学习笔记 一)"
subtitle: "mongoose的基础知识"
date: 2017-12-24
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags: 
    - Node.js
    - MongoDB
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


这个系列将记载我在学习Node.js中常用的包相关的内容，作为以后工作中的备忘笔记。
[官方文档](http://mongoosejs.com/docs/api.html)
[社区文档](http://www.nodeclass.com/api/mongoose.html)

----------


### 安装mongoose
-------------

```
    npm install mongoose
```

### 连接mongoose
-------------

```
    var mongoose = require('mongoose');

    mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds147681.mlab.com:47681/aishuangying');

    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('connect success');
    });
```
[点击这里](http://www.nodeclass.com/api/mongoose.html#connection-js)文档了解更多connection事件

### Schema
-------------
Schema是mongoose的定义表结构的数据模式。
每个Schema会映射到mongodb中的一个collection，但是它不具备操作数据库的能力。
定义Schema

```
    var Schema = mongoose.Schema;         //这里的mongoose就是上面初始化好的mongoose变量

    var OneSchema = new Schema({          
        username : { type: String },
        userpwd: {type: String},
        userage: {type: Number},
        logindate : { type: Date}
    });
```
[点击这里](http://www.nodeclass.com/api/mongoose.html#schematype-js)文档了解更多Schema类型

### Model
-------------
定义好Schema之后生成Model
model是由schema生成的模型，可以对数据库的操作
我们对上面的定义的user的schema生成一个User的model并导出，修改后代码如下

```
    var oneModel = mongoose.model('newUser',OneSchema);
```
这里的'User'就是数据库中对应的Collection名称

### 常用的数据库操作
-------------

插入数据库

```
    function insert() {
        var one = new oneModel({
            username : 'Tracy McGrady',                 //用户账号
            userpwd: 'abcd',                            //密码
            userage: 37,                                //年龄
            logindate : new Date(),                      //最近登录时间
            updateTime : new Date()
        });
        one.save(function (err, res) {
            if (err) {
                console.log("Error:" + err);
            }
            else {
                console.log("Res:" + res);
            }
        });
    }
    insert();
```
更新数据库

```
    function update(){
        var wherestr = {'username' : 'Tracy McGrady'}
        var updateinfo = {'updateTime' : new Date()};
        
        oneModel.update(wherestr, updateinfo , function(err, res){
            if (err) {
                console.log("Error:" + err);
            }
            else {
                console.log("Res:" + res);
            }
        })
    }
    update();
```
更新规则，在这类model中按名称来更新updateTime属性。
查询

```
    function getByConditions(){
        var wherestr = {'username' : 'Tracy McGrady'};
    
        oneModel.find(wherestr, function(err, res){
            if (err) {
                console.log("Error:" + err);
            }
            else {
                console.log("Res:" + res);
            }
        })
    }   
    getByConditions();
```
返回的res为
```
    { 
        _id: 5a3f6664b2938f0517a2fa2e,
        username: 'Tracy McGrady',
        userpwd: 'abcd',
        userage: 37,
        logindate: 2017-12-24T08:33:40.714Z,
        updateTime: 2017-12-24T08:35:48.898Z,
        __v: 0 
    }
```
第2个参数可以设置要查询输出的字段,比如 var opt = {"username": 1 ,"_id": 0};
返回的res为
```
    { username: 'Tracy McGrady' }
```
比如我要查询年龄范围条件应该怎么写呢？
```
    oneModel.find({userage: {$gte: 21, $lte: 65}}, callback);    //这表示查询年龄大于等21而且小于等于65岁
```
其实类似的还有：　

　　$or　　　　       或关系
　　$nor　　　        或关系取反
　　$gt　　　　       大于
　　$gte　　　        大于等于
　　$lt　　　　       小于
　　$lte　　　        小于等于
　　$ne              不等于
　　$in              在多个值范围内
　　$nin             不在多个值范围内
　　$all             匹配数组中多个值
　　$regex　　        正则，用于模糊查询
　　$size　　　       匹配数组大小
　　$maxDistance　   范围查询，距离（基于LBS）
　　$mod　　         取模运算
　　$near　　　       邻域查询，查询附近的位置（基于LBS）
　　$exists　　      字段是否存在
　　$elemMatch　　   匹配内数组内的元素
　　$within　　      范围查询（基于LBS）
　　$box　　　       范围查询，矩形范围（基于LBS）
　　$center         范围醒询，圆形范围（基于LBS）
　　$centerSphere　　范围查询，球形范围（基于LBS）
　　$slice　　　　    查询字段集合中的元素（比如从第几个之后，第N到第M个元素）
建索引和设置默认值

```
    var UserSchema = new Schema({          
        username : { type: String , index: true},  
        userpwd: {type: String},                    
        userage: {type: Number},                   
        logindate : { type: Date, default:Date.now} 
    });
```
　

更多的操作，查询[官方文档](http://www.nodeclass.com/api/mongoose.html#model-js)