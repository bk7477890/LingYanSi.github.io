主要实现类似虾米播放器的一系列功能

##2015/5/2

其实基于audio的播放器，之前已经做过了，但是js代码写得实在太挫，于是51这两天就把轮子重造一下
目前，单页面的功能基本已经实现   
* 歌曲切换
* 进度条
* 音量调节
* 歌词同步
* 自定义滚动条
* 高斯模糊背景
* 顺序模式切换
页面布局，主要是用了flex

下一步主要就是，双页面通信，会以localhost形式实现

##2015/5/4

修补了，当窗口变化时，【滚动条、进度条、音量条】不会等比例跟随的bug

##2015/5/6

实现了利用localStorage的双页面通信，以及只打开一个播放放页面的功能