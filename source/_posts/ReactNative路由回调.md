---
layout: post
title: "ReactNative路由回调"
date: 2018-2-28
author: "Ai Shuangying"
tags:
	- ReactNative
---


所遇问题：希望采用goBack进行页面回退，但需要回退页面触发重绘

解决方法：路由跳转时传参回调函数，重绘页面

----------

因为在页面里使用了react-native-I18n来做国际化，页面内修改语言后需要回退到上个页面，同时期望此页面已经修改了语言，也就是要触发重绘，原有的做法是，通过
```
navigate('****')
```
直接跳转到上个页面的路由，但是这样做导致的结果是上一页面从屏幕右侧划出，虽然页面确实重新加载了，但是给用户的回馈很奇怪，所以我决定修正过来，采用
```
goBack()
```
方式来回退到上一页面，但这样会发现回退的页面并没有发生变化，也就是没有触发重绘。

考虑到这个问题，我就需要一个函数来确保重绘页面，也就是
```
	forceUpdate(){
	    this.setState({I18n: 1});
	}
```
通过setState来触发重绘，传入的I18n是个无意义的值即可，如果需要重新加载这个页面的数据，也可以放在这个函数里，这样在子页面返回的时候，这个页面就会更新成最新的数据了。

函数有了，下一步就是将这个函数随路由传递到下个页面去
```
	this.props.navigation.navigate('testChildScreen', { onGoBack: () => this.forceUpdate() }); }
```
这里注意通过ES6的写法来绑定this，用bind(this)也可以。

这样参数函数就传递过去了，下面进入子页面
```
	this.props.navigation.state.params.onGoBack();
    Alert.alert(null,'success',[{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
```
这里的逻辑是用户修改语言后给一个反馈，点击OK后自动返回上一页面，在goBack之前先调用一下回调函数

好了，这样返回页面后就看到新语言的页面了，但是会发现页面标题并没有变化，也就是说并没有触发navigation的重绘
```
	static navigationOptions = ({ navigation }) => {
    	return {
      		headerTitle: I18n.t('me_title'),
    	}
  	}
```

.
.
.
通过查询Stack Overflow后发现navigation的一个类似setState的方法可以触发重绘，修改forceUpdate
```
	forceUpdate(){
    	this.setState({I18n: 1});
    	this.props.navigation.setParams({editState:true });
  	}
```
这里的setParams就可以触发navigation重绘，传递的editState也是一个无意义的值，同时这个方法也可用于动态修改标题的目的。

问题解决。