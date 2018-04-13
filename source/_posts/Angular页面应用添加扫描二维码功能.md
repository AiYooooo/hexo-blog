---
layout: post
title: "Angular页面应用添加扫描二维码功能"
date: 2018-3-20
author: "Ai Shuangying"
tags:
	- Angular
---

----------

最近突然接到一个任务就是在Angular应用里需要一个扫描二维码的功能，当然是前往Github看一看有没有合适的轮子啊
逛了一圈看看demo我决定使用这个[@zxing/ngx-scanner](https://github.com/zxing-js/ngx-scanner)
看他的文档使用起来比较简单，测试用例效果也不错，事实证明我还是太年轻了 =。=|||


报错

```
  ERROR in Metadata version mismatch for module C:/gitRepo/gmdias/gmdais-frontend/node_modules/@angular/animations/browser/browser.d.ts, found version 4, expected 3, resolving symbol ɵf in C:/gitRepo/gmdias/gmdais-frontend/node_modules/@angular/platform-browser/animations/index.d.ts, resolving symbol BrowserAnimationsModule in C:/gitRepo/gmdias/gmdais-frontend/node_modules/@angular/platform-browser/animations/index.d.ts, resolving symbol BrowserAnimationsModule in C:/gitRepo/gmdias/gmdais-frontend/node_modules/@angular/platform-browser/animations/index.d.ts
```

看起来应该是Metadata的包与版本有冲突，但是Google了一下发现很多人都出现了这个问题，而且并不好解决

[Metadata version mismatch with Angular 4](https://stackoverflow.com/questions/47115649/metadata-version-mismatch-with-angular-4)
[Github](https://github.com/angular/material2/issues/8229)
[Github](https://github.com/KillerCodeMonkey/ngx-quill/issues/76)

等等，查阅了很多，最后还是整体升级到了Angular5，并更新了所有依赖模块才解决这个问题。


但是，引入包之后仅仅在HTML中使用

```
<zxing-scanner
    [scannerEnabled]="scannerEnabled"
    [autofocusEnabled]="autofocusEnabled"
    [device]="selectedDevice"
    [cssClass]="'small-video'"
    (camerasFound)="displayCameras($event)"
    (scanSuccess)="handleQrCodeResult($event)"
></zxing-scanner>
```

并不能生效。

结合示例，ts文件我是这样用的

``` JS
  import { Router, ActivatedRoute, ParamMap } from '@angular/router';
  import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
  import { ZXingScannerComponent } from '@zxing/ngx-scanner';
  import { Result } from '@zxing/library';
 
  @Component({
    selector: 'coinscan',
    styleUrls: [ './coinscan.component.css' ],
    templateUrl: './coinscan.component.html'
  })
  export class CoinScanComponent implements OnInit {

    @ViewChild('scanner') scanner: ZXingScannerComponent;

    constructor() {
    }

    hasCameras = false;
    hasPermission: boolean;
    diviceIndex: number = 0;
    availableDevices: MediaDeviceInfo[];
    selectedDevice: MediaDeviceInfo;

    ngOnInit(): void {
      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.hasCameras = true;
        this.availableDevices = devices;
        //取到相机设备，并默认开启并选中最后一个(在手机Web端则是后置摄像头)
        if(devices.length){
          this.selectedDevice = this.scanner.getDeviceById(devices[devices.length - 1].deviceId);
        }
      });
      //获取相机使用权限
      this.scanner.permissionResponse.subscribe((answer: boolean) => {
        // alert(answer);
        this.hasPermission = answer;
      });
    }
    //取到识别结果
    handleQrCodeResult(resultString: string) {
      if(confirm("Address："+resultString)){
        this.dataBaseService.qrscan_address = resultString;
      }
    }
    //针对移动浏览器自己添加按钮，来依次切换摄像头设备，比如前后置摄像头切换
    gotoAround(): void {
      this.diviceIndex += 1;
      if(this.diviceIndex == this.availableDevices.length){
        this.diviceIndex = 0;
      }
      this.selectedDevice = this.scanner.getDeviceById(this.availableDevices[this.diviceIndex].deviceId);
    }

}
```

从而实现了预期要求。

但是在ApiCloud打包的Native App中却无法得到相机使用权限，待补充。



