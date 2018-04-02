---
layout: post
title: "使用VPS搭建VPN"
subtitle: "没错，小梯子"
date: 2018-1-20
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- VPS
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


最近公司的服务器出了点小问题，梯子用不了了，考虑到自己还有一台服务器闲置，所以拿出来搭个梯子自用。

----------


#### 准备工作
-------------


首先要有一台VPS，推荐购买美国的，自用的是洛杉矶服务器，最低配即可。

-------------

#### 一键部署

服务器系统为CentOS 7，其余系统可参照官网采用不同的包。


```
wget –no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh
//回车

chmod +x shadowsocks.sh
//回车

./shadowsocks.sh 2>&1 | tee shadowsocks.log
//回车

//安装过程中会有两三次提示，分别要求设置 端口、密码及加密方式，直接回车会使用默认设置

//程序执行完成后需要到/etc/shadowsocks.json文件中将server 0.0.0.0改成自己vps的ip

//多用户配置
{
    "server":"0.0.0.0",
    "local_address":"127.0.0.1",
    "local_port":1080,
    "port_password":{
         "8989":"password0",
         "9001":"password1",
         "9002":"password2"
    },
    "timeout":300,
    "method":"your_encryption_method",
    "fast_open": false
}
启动：/etc/init.d/shadowsocks start
停止：/etc/init.d/shadowsocks stop
重启：/etc/init.d/shadowsocks restart
状态：/etc/init.d/shadowsocks status

//结束
//自己电脑上下载Shadowsocks客户端（Mac OS上为ShadowsocksX-NG）输入自己的配置即可
```

