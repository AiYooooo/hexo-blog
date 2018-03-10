---
layout: post
title: "Nginx的安装及配置"
subtitle: "在一台服务器上配置多个程序"
date: 2018-1-28
author: "Ai Shuangying"
header-img: "hack.jpeg"
cdn: 'header-on'
tags:
	- Nginx
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->

使用服务器系统版本为CentOS 7

----------


### 安装Nginx
-------------

```
yum apt-get install nginx

//安装成功后检查版本
nginx -v

//配置Nginx
cd /etc/nginx

cd conf.d

//编辑配置文件
sudo vi example-com-8888.conf
//输入以下内容
```

```
upstream test {
    server 127.0.0.1:18080;
}

server {
    listen 80;
    server_name /* 这里填自己的VPS外网地址 */;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        proxy_pass http://test;
        proxy_redirect off;
    }
}
```

```
//配置好后返回上层目录即 /etc/nginx 目录
//查看nginx配置文件

sudo vi nginx.conf
//主要是检查其中是否把自定的配置文件导入了进来
//从此文件中找到下面这句看是否被注释了

    include /etc/nginx/conf.d/*.conf
    //这句命令的含义是将/etc/nginx/conf.d/目录下的所有.conf结尾的配置文件都导入进来

    //同时在此文件的http部分取消注释或添加下句可隐藏掉服务器输出的nginx信息
    server_tokens off;

    //重启服务
    sudo service nginx reload

//检查配置文件
sudo nginx -t

//检查通过后重启nginx
sudo nginx -s reload
```
