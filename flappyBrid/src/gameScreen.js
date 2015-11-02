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
    bird : null,
    ground : null,
    _animation : null,
    hoseSpriteList : [],     //保存管道
    gameState : "start",
    passTime: 0,
    sorce : 0,
    ctor : function() {
        this._super();
        this.init();
    },
    init : function() {
        this.hoseSpriteList = [];
        var _self = this;
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
        cc.eventManager.addListener({
            event : cc.EventListener.MOUSE,
            onMouseDown : function(event) {
                if(this.gameState === "end") {
                    return true;                 //游戏结束
                }
                console.log("屏幕被点击了");
                _self.birdRun();
            }
        }, this);
        this.scheduleUpdate();       //每帧检测
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
        var hoseWidth = 100;    //水管宽度
        var hoseHeight = 238;   //水管长度
        var acrossHeight = 120; //穿过通道长度
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
        //console.log("开始每帧检测");
        var temp = [];
        if(this.gameState !== "start") {
            return;
        }
        for(var i = 0, len = this.hoseSpriteList.length; i < len; i++) {
            var pipe = this.hoseSpriteList[i];   //取水管
            pipe.setPositionX(pipe.getPositionX() - 3);      //返回在cocos2d坐标系中的位置X
            if(pipe.getPositionX() < 100) {
                this.sorce++;                    //分数+1
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
        var boxA = eleA.getBoundingBox(),    //获取包含该图形的矩形框
            bottom = cc.p(boxA.x + boxA.width / 2, boxA.y),
            right = cc.p(boxA.x + boxA.width, boxA.y + boxA.height / 2),
            left = cc.p(boxA.x, boxA.y + boxA.height / 2),
            top = cc.p(boxA.x + boxA.width / 2, boxA.y + boxA.height);
        var boxB = eleB.getBoundingBox();
        return cc.rectContainsPoint(boxB, left) || cc.rectContainsPoint(boxB, right) || cc.rectContainsPoint(boxB, top) || cc.rectContainsPoint(boxB, bottom);
    },    //碰撞检测函数
    checkCollision : function() {
        if(this.collide(this.bird, this.ground)) {
            console.log("碰撞");
        }
        for(var i = 0, len = this.hoseSpriteList.length; i < len; i++) {
            var pipe = this.hoseSpriteList[i];
            if(this.collide(this.bird, pipe)) {
                console.log("水管碰撞");
                break;
            }
        }
    },
    birdFallAction : function() {
        this.gameState = "over";
        this.bird.stopAllActions();
        this.ground.stopAllActions();
        var birdX = this.bird.getPositionX();
        var birdY = this.bird.getPositionY();
    }
})
