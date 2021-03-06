---
layout: post
title: "react-native-echarts在安卓下可滑动的问题"
date: 2018-3-16
author: "Ai Shuangying"
tags:
	- ReactNative
---

----------

在最近的项目里简单使用了[react-native-echarts](https://github.com/somonus/react-native-echarts)，引入和配置都很简单，但是做出的表格在安卓下却存在一个很大的容器使之可以滑动从而导致大片的空白，在IOS下则没有这个现象，这里记录下解决办法。


打开源码node_modules\native-echarts\src\components\Echarts\index.js里面

```
<WebView
  ref="chart"
  scrollEnabled = {false}
  injectedJavaScript = {renderChart(this.props)}
  style={{
    height: this.props.height || 400,
    backgroundColor: this.props.backgroundColor || 'transparent'
  }}
  scalesPageToFit={false}          
  source={require('./tpl.html')}
  onMessage={event => this.props.onPress ? this.props.onPress(JSON.parse(event.nativeEvent.data)) : null}
/>
```

里面scalesPageToFit={false}就是导致这个问题的原因。

但是安卓和IOS对这个属性的处理是不一致的，或者说是相反的，所以我们需要针对系统来做判断。

修改后的版本：

scalesPageToFit={Platform.OS === 'ios' ? false : true}

不要忘了从react-native 中引入Platform

done()