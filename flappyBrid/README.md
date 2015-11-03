### flappy bird 小游戏
##### 游戏内容记录  
这是我的第一次完成小游戏，有很多问题吧，现在记录在这里。  
游戏由一个主场景 GameLayer完成。    

小鸟精灵：  问题主要存在于帧动画;   
```
 /*
  *添加帧动画进入，然后分批处理图片SpriteBatchNode用来提高图片加载效率。
  */
    cc.spriteFrameCache.addSpriteFrames("res/bird.plist");
    cc.SpriteBatchNode.create("res/bird.png");  
 /*
  * 接着建立一个Animation对象， 循环添加帧图片帧，最后执行动画
  * /
    for(var i = 0; i < 3; i++) {
        var str = "bird-" + (i + 1) + ".png";
        this._animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(str));
    }
    this._animation.setDelayPerUnit(0.1);      //设置帧间隔
    var action = cc.animate(this._animation).repeatForever();
    this.runAction(action);
```  
帧动画会利用到的函数中：  
`cc.Animation`， `cc.spriteFrameCache`,  `cc.SpriteBatchNode`， `cc.animate` 其中次`cc.setLocalZOrder`已经代替原来的
函数。   

动画： 动画的问题就是一个有限的动画和一个无限的动画不能利用`spwan`执行。想同时执行的话，分开写即可，不要用`spwan`连接  

水管的添加和删除：  
离开屏幕的水管对象要及时删除，避免精灵过多导致页面卡顿。这里删除水管数组的时候不能直接splice在循环里面这样会导致
循环发生错误。建立临时的数组即可。  
`cc.Node.setPosition`, `cc.Node.getPositionX`, `cc.winSize.width`, `cc.winSize.height`  

添加事件：  
注意ccui的事件添加和cc不能采用同一个；ccui的事件添加：  
```
ccui.addClickEventListener(callFunc)     //注意，ccui鼠标事件只有点击，没有移动和松开
```  
如果对ccui的对象按照cc的事件添加方式会发生严重错误，导致执行失败。  
注意事件中的this指向 var _self = this;  

ccs的使用：  
最新的记载cocosStudio方法为：  
```
var mainUI = ccs.load("res/MainUi/MainScreen.json");  //加载cocosStudio，返回一个ccui节点  
ccui.helper.seekWidgetByName(mainUI.node, "名称");    //这里要使用node才可以
```  
导演：  
新版取消了`replaceScene` 直接使用`runSceen`即可  
```
cc.director.runScene(new cc.TransitionFade(1, new GameScreen()));  场景切换动画
```   

update:  
本例中采用在layer中添加update函数，从而达到帧控制，实现水管的移动和碰撞检测。请看帧控制。和如何实现不减速的帧  

碰撞检测：  
本代码，采用的是外接矩形的检测方法，该方法有个问题就是，要避免alpha通道对图形的影响，如果检测的图形离矩形差距很大，
这种检测方法将严重失败。  

```
    collide : function(eleA, eleB) {
        var boxA = eleA.getBoundingBox(),
            boxB = eleB.getBoundingBox();
        return cc.rectIntersectsRect(boxA, boxB);
    },    //碰撞检测函数  
``` 
其他的碰撞检测请参考别的案例：分离轴定理。  

最后由于只是练手，结果保存和结果展示部分，不在使用图片，没有添加动画。想完善代码的可以修改这部分。