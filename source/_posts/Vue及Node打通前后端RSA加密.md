---
layout: post
title: "Vue及Node打通前后端RSA加密"
date: 2019-05-14
author: "Ai Shuangying"
tags:
	- Vue
	- Node.js
---

----------

最近项目里用到，用Vue和Node写了一个前后端RSA加密的demo，记录一下。

在线地址： [登录加密demo](https://encrypt.aiyo.tech/)

### RSA
-------------

RSA是一种非对称加密，简单的说就是在服务器端生成一对公钥和私钥，将公钥传给前端用来对信息进行加密，然后后端用对应的私钥对传过来的加密数据进行解密，就可以得到信息了，即便中途加密信息被截获，在没有私钥的情况下也无法得到原始信息，相对来说是一种较为安全的加密方法。


下面就是一个最简单的登录加密的demo，复杂逻辑可以由此入手进行扩展。


### Vue
-------------

前端采用了Vue框架，实现起来还是较为简单的，用到了一个JSEncrypt包。

首先在初始化的时候去请求一个publicKey

```
	import JSEncrypt from 'jsencrypt/bin/jsencrypt'

	...

	mounted: function(){
			var that = this;
			axios.get('http://localhost:8082/publicKey')
				.then(function (response) {
					that.safepub = response.data;	//此处拿到后端生成的公钥，存下来
				})
				.catch(function (error) {
					alert(error);
				});
		}

```

接下来在登录的时候将数据加密发送

```
	this.loginmes = 'username='+this.username + '&password='+this.password;
	let encryptor = new JSEncrypt();
	encryptor.setPublicKey(this.safepub);

	let encodemess = encryptor.encrypt(this.loginmes);
	this.safemess = encodemess;

	var that = this;
	axios.post('http://localhost:8082/decryption', {
			value: encodemess
		})
		.then(function (response) {
			that.loginsuccess = response.data;
		})
		.catch(function () {
		});
```

配套的其他部分自己补充即可，下面看Node的部分


### Node.js
-------------

Node方面用到了一个node-rsa包，安装之后就可以使用了

```
	const NodeRSA = require('node-rsa');
	const safekey = new NodeRSA({b: 1024});
	safekey.setOptions({encryptionScheme: 'pkcs1'});
	var publicDer = safekey.exportKey('public');
	var privateDer = safekey.exportKey('private');
	//这里就生成了公钥和私钥备用
```

当前端请求公钥的时候只要把publicDer发过去即可

当前端发送加密数据的时候，用对应此公钥的safekey进行解密

```
	var keyValue = req.body.value;
    const decrypted = safekey.decrypt(keyValue, 'utf8');
    //即可拿到形如 'username=moumou&password=123456' 的原信息串，再进行处理即可
```

以上只是一个简单的非对称加密demo，因为后端会用JAVA重写，而在这个过程中前端十分简单。
