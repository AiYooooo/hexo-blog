---
layout: post
title: "Nginx部署静态网页"
date: 2018-2-5
author: "Ai Shuangying"
tags:
	- Nginx
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->

----------


### 首先建立一个存放静态网页的文件夹
-------------

``` bash
pwd

/root/static_html/resume
//root文件夹下的static_html文件夹下创建resume文件夹，里面放置静态文件
```

### 配置Nginx
-------------

```
cd /etc/nginx/conf.d/
//创建新的 .conf 文件
```

```
server {
  listen 80;
  server_name resume.*******.com; //填写访问用的域名
  root /root/static_html/resume;
  index index.html;
  location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt){
    root /root/static_html/resume;
  }
}
```

重启Nginx

``` bash
sudo nginx -s reload
```

域名解析好后访问resume.*******.com即可

如果报错403，可能是Nginx权限问题

打开Nginx配置文件

``` bash
vi /etc/nginx/nginx.conf

//在这个文件中将
user nginx;
//改成
user root;
//重启Nginx即可
```


再次访问resume.*******.com可以了。