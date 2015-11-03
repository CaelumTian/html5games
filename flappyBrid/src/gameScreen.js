/**
 * 说明:取任意值开始 至 任意值的随机整数
 * 参数:
 under:起始值
 over: 终止值
 */
function fRandomBy(under, over){
    switch(arguments.length){
        case 1: return parseInt(Math.random()*under+1);
        case 2: return parseInt(Math.random()*(over-under+1) + under);
        default: return 0;
    }
}
/**
 * Created by DELL on 2015/10/31. 游戏场景
 */
var GameLayer = cc.Layer.extend({
    readyLayer : null,
    bird : null,
    ground : null,
    _animation : null,
    hoseSpriteList : [],     //保存管道
    gameState : "start",
    passTime: 0,
    sorce : 0,
    innerWidth : 0,
    innerHeight : 0,
    ctor : function() {
        this._super();
        this.init();
    },
    init : function() {
        var _self = this;
        this.hoseSpriteList = [];
        this.innerWidth = cc.winSize.width;
        this.innerHeight = cc.winSize.height;
        this.gameState = "ready";

        cc.eventManager.addListener({
            event : cc.EventListener.MOUSE,
            onMouseDown : function(event) {
                event.stopPropagation();
                if(_self.gameState === "over") {
                    return true;                 //游戏结束
                }
                console.log("屏幕被点击了");
                _self.birdRun();
            }
        }, this);

        this.initReadyLayer();    //插入遮罩层
        this.scheduleUpdate();       //每帧检测
    },
    initReadyLayer : function() {
        var _self = this;
        this.readyLayer = new cc.Layer();

        var bg = new cc.Sprite("res/MainUi/bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.readyLayer.addChild(bg);

        var whiteImg = new cc.Sprite("res/readyLayer/whiteTitle.png");
        whiteImg.x = 187.5;
        whiteImg.y = 530.0;
        this.readyLayer.addChild(whiteImg);

        var ready = new cc.Sprite("res/readyLayer/ready.png");
        ready.x = 187.5;
        ready.y = 420.0;
        this.readyLayer.addChild(ready);

        var startGame = new cc.Sprite("res/readyLayer/startGame.png");
        startGame.x = 187.5;
        startGame.y = 270;
        this.readyLayer.addChild(startGame);

        var ground = new cc.Sprite("res/MainUi/ground.png");
        var action1 = cc.moveBy(1, cc.p(-(ground.width - cc.winSize.width), 0)),
            action2 = cc.moveBy(0, cc.p(ground.width - cc.winSize.width, 0)),
            sequence = cc.sequence(action1, action2);
        ground.runAction(cc.repeatForever(sequence));
        ground.x = 281.25;
        ground.y = 62.50;
        this.readyLayer.addChild(ground);

        this.addChild(this.readyLayer);

        cc.eventManager.addListener({
            event : cc.EventListener.MOUSE,
            onMouseDown : function(event) {
               // event.stopPropagation();
                if(_self.gameState === "ready") {
                    _self.gameState = "start";     //游戏开始
                    _self.readyLayer.setVisible(false);   //隐藏该层
                    _self.initBackground();        //启动后序渲染
                }
            }
        }, this.readyLayer)
    },
    initBackground : function() {
        var bg = new cc.Sprite("res/MainUi/bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg, 1);

        var ground = new cc.Sprite("res/MainUi/ground.png");
        var action1 = cc.moveBy(1, cc.p(-(ground.width - cc.winSize.width), 0)),
            action2 = cc.moveBy(0, cc.p(ground.width - cc.winSize.width, 0)),
            sequence = cc.sequence(action1, action2);
        ground.runAction(cc.repeatForever(sequence));
        ground.x = 281.25;
        ground.y = 62.50;
        this.ground = ground;

        this.addChild(ground, 2);
        this.bird = new FlappyBird();

        this.bird.x = 100;
        this.bird.y = cc.winSize.height / 2;

        this.addChild(this.bird, 4);
        this.birdRun();    //第一次初始画的时候触发
    },
    birdRun : function() {
        var birdX = this.bird.x,
            birdY = this.bird.y,
            duration = birdY / 600;
        if(birdY >= cc.winSize.height - 70) {
            return true;
        }
        this._animation = new cc.Animation();
        for(var i = 0; i < 3; i++) {
            var str = "bird-" + (i + 1) + ".png";
            this._animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(str));
        }
        this._animation.setDelayPerUnit(0.1);
        var flashWings = cc.animate(this._animation).repeatForever();

        var riseAction1 = cc.moveTo(0.2, cc.p(birdX, birdY + BirdConst["RISE_HEIGHT"])),
            riseAction2 = cc.rotateTo(0.2, -30),
            riseAction = cc.spawn(riseAction1, riseAction2);   //点击小鸟上飞动作

        var fallAction1 = cc.moveTo(duration, cc.p(birdX, 142.5)).easing(cc.easeIn(2)),
            fallAction2 = cc.rotateTo(0.2, 30),
            fallAction = cc.spawn(fallAction1, fallAction2);  //小鸟落地, 延时

        this.bird.stopAllActions();
        this.bird.runAction(flashWings);     //翅膀扇动
        this.bird.runAction(cc.sequence(
            riseAction,
            fallAction                       //必须分开写，spwan不能有限和无限的动画结合
        ))
    },
    addHose : function() {
        var groundHeight = 125;       //地砖高度
        var hoseImageHeight = 480;    //水管图片的长度
        var hoseWidth = 90;    //水管宽度
        var hoseHeight = 238;   //水管长度
        var acrossHeight = 150; //穿过通道长度
        var downHeight = fRandomBy(50, hoseHeight);
        var topHeight = cc.winSize.height - acrossHeight - downHeight - groundHeight;     //上水管高度

        var topHose = new cc.Sprite("res/hoseTop.png");
        topHose.setPosition(cc.p(cc.winSize.width + hoseWidth, cc.winSize.height - topHeight + hoseImageHeight / 2));           //该方法继承于cc.Node
        topHose.setLocalZOrder(1);     //设置绘制消息顺序，值越小越先绘制（取代setZorder）
        this.addChild(topHose, 2);

        var bottomHose = new cc.Sprite("res/hoseBottom.png");
        bottomHose.setPosition(cc.p(cc.winSize.width + hoseWidth, downHeight + groundHeight - hoseImageHeight / 2));
        bottomHose.setLocalZOrder(1);
        this.addChild(bottomHose, 1);

        this.hoseSpriteList.push(topHose);
        this.hoseSpriteList.push(bottomHose);    //添加水管
    },
    update : function() {
        var temp = [];
        if(this.gameState !== "start") {
            return;
        }
        for(var i = 0, len = this.hoseSpriteList.length; i < len; i++) {
            var pipe = this.hoseSpriteList[i];   //取水管
            pipe.setPositionX(pipe.getPositionX() - 3);      //返回在cocos2d坐标系中的位置X
            if(pipe.getPositionX() < 100 && pipe.sorceflag === undefined) {
                pipe.sorceflag = true;
                this.sorce += 0.5;                    //分数+0.5(两根水管一分，标志位标记水管不能被重复计算)
            }
            if (pipe.getPositionX() < -50) {     //getContenSize返回为变换之前的大小（如果水管超出场景）
                this.removeChild(pipe);          //删除页面外的精灵
            }else {
                temp.push(pipe);                 //没有被删除的数组
            }
        }

        this.hoseSpriteList = temp;

        this.passTime += 1;
        if(this.passTime >= cc.winSize.width / 6) {
            this.addHose();
            this.passTime = 0;
        }
        this.checkCollision();
    },
    collide : function(eleA, eleB) {
        var boxA = eleA.getBoundingBox(),
            boxB = eleB.getBoundingBox();
        return cc.rectIntersectsRect(boxA, boxB);
    },    //碰撞检测函数
    checkCollision : function() {
        if(this.collide(this.bird, this.ground)) {
            console.log("碰撞");
            this.fallAction();
        }
        for(var i = 0, len = this.hoseSpriteList.length; i < len; i++) {
            var pipe = this.hoseSpriteList[i];
            if(this.collide(this.bird, pipe)) {
                console.log("水管碰撞");
                this.fallAction();
                break;
            }
        }
    },
    fallAction : function() {
        var _self = this;
        this.gameState = "over";
        this.bird.stopAllActions();
        this.ground.stopAllActions();
        var birdX = this.bird.getPositionX(),
            birdY = this.bird.getPositionY(),
            duration = birdY / 600;;
        var fallAction1 = cc.moveTo(duration, cc.p(birdX, 142.5)).easing(cc.easeIn(2)),
            fallAction2 = cc.rotateTo(0.2, 90),
            fallAction = cc.spawn(fallAction1, fallAction2);  //小鸟旋转90落地, 延时
        this.bird.runAction(cc.sequence(cc.delayTime(0.1), fallAction));
        this.scheduleOnce(this.showGameOver, 1);     //延迟1秒执行
    },
    showGameOver : function() {
        var _self = this;
        console.log("最终得分：" + this.sorce);
        var gameOver = new cc.Layer();

        var bg = new cc.Sprite("res/MainUi/bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        gameOver.addChild(bg);

        var ground = new cc.Sprite("res/MainUi/ground.png");
        ground.x = 281.25;
        ground.y = 62.50;
        gameOver.addChild(ground);

        var gameover = new cc.Sprite("res/readyLayer/gameover.png");
        gameover.x = 187.5;
        gameover.y = 520.0;
        gameOver.addChild(gameover);

        var sorceCount = new cc.Sprite("res/readyLayer/sorceCount.png");
        sorceCount.x = 187.5;
        sorceCount.y = 364;
        gameOver.addChild(sorceCount);

        var restart = new cc.Sprite("res/readyLayer/restart.png");
        restart.x = 100;
        restart.y = 220;
        gameOver.addChild(restart);

        var share = new cc.Sprite("res/readyLayer/share.png");
        share.x = 270;
        share.y = 220;
        gameOver.addChild(share);

        var sorceText = new cc.LabelTTF(this.sorce, "georgia", 25);
            sorceText.color = cc.color(2, 77, 140);
        sorceText.x = 274.86;
        sorceText.y = 384.86;
        gameOver.addChild(sorceText);
        console.log(gameOver);
        this.addChild(gameOver, 7);
        cc.eventManager.addListener({
            event : cc.EventListener.MOUSE,
            onMouseDown : function() {
                _self.restartGame();
            }
        }, restart);
    },
    restartGame : function() {
        var scene = new cc.Scene();
        scene.addChild(new GameLayer());
        cc.director.runScene(scene);
    }
})
