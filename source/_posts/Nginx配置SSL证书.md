---
layout: post
title: "Nginx配置SSL证书"
date: 2018-3-10
author: "Ai Shuangying"
tags:
	- Nginx
---

<!-- LeetCode刷题系列(1)(question 3)
=================== -->


前些天记录了[Nginx的安装及配置](./Nginx的安装及配置.md)和[Nginx部署静态网页](./Nginx部署静态网页.md)两篇文章，后来白菜价入了一台国内的ECS，因为备案流程太长，如果想要将自己的博客放在国内服务器上怎么办呢？那么SSL证书就派上用场了。

SSL 证书就是遵守 SSL协议，由受信任的数字证书颁发机构CA，在验证服务器身份后颁发，具有服务器身份验证和数据传输加密功能。

在这里我用的免费SSL证书提供商是[FreeSSL](https://freessl.org/)

----------


#### 准备工作
-------------

首先域名要解析到所用服务器上，后面会介绍根据不同的子域名配置各自的SSL证书。

然后服务器(尤其是ECS的安全组策略)要开放对80(http)和443(https)的端口访问权限，不然配置成功了也访问不了的。

然后就是安装并配置Nginx，我的其他博客也有相关内容的介绍，请自行查阅。


#### 申请证书
-------------

[FreeSSL](https://freessl.org/)的申请流程还是很简单的，推荐使用TrustAsia的服务，时长一年，需要用到哪个子域名的时候单独申请一下就可以了很方便。

这里用到DNS验证，主要是为了验证此域名的所有权是否是本人，只需要根据它给出的TXT Record值在域名控制台中做个对应的解析就可以了，验证成功后就可以下载了。

-------------

#### 配置nginx.conf
-------------

默认安装的nginx是没有开放ssl配置的，我们手动来打开

``` 
    # Settings for a TLS enabled server.
    #
    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        ssl                 on;
        ssl_certificate     ***.pem;
        ssl_certificate_key ***.key;

        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```

这段默认是注释掉的，我们打开它，同时注意里面需要配置的就是ssl_certificate 和 ssl_certificate_key 两项，这里把申请好下载的证书传到服务器里并填写好访问路径就可以了。

另外如果配置完成报403错误，应该是nginx的权限不足，在这个文件顶部的user nginx;改为user root;就可以了。

这里放的证书可以是对主域名申请的证书 ****.com 

#### 配置子域名.conf
-------------

这里用一个静态文件服务来举例子

```
    server {
        listen 443 ssl;
        server_name resume.aishuangying.com;
        root /root/static_html/resume;

        ssl_certificate     cert/resume_chain.pem;
        ssl_certificate_key cert/resume_private.key;

        index index.html;
        location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt){
            root /root/static_html/resume;
        }
    }
```

这里还是填好ssl_certificate 和 ssl_certificate_key 这是子域名用的证书。

这里需要注意的就是监听的端口需要更改为443，因为现在的协议改为了https而这使用的是443端口。


这里只是简单的配置SSL证书，当需求变复杂的时候配置也会相应得复杂，当我碰到这类问题的时候我会更新在这里。