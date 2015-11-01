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
    _animation : null,
    hoseSpriteList : [],     //保存管道
    ctor : function() {
        this._super();
        this.init();
    },
    init : function() {
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
        this.addChild(ground, 2);
        this.bird = new FlappyBird();
        this.bird.x = 100;
        this.bird.y = cc.winSize.height / 2;
        this.addChild(this.bird, 2);
        cc.eventManager.addListener({
            event : cc.EventListener.MOUSE,
            onMouseDown : function(event) {
                console.log("屏幕被点击了");
                _self.birdRun();
            }
        }, this)
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
    newHose : function() {
        var hoseHeight = 238;   //水管长度
        var acrossHeight = 151; //穿过通道长度
        var downHeight = fRandomBy(50, hoseHeight);
        var topHeight = cc.winSize.height - acrossHeight - downHeight;     //上水管高度
        var topHose = new cc.Sprite("res/hoseTop.png");
        topHose.x = 400 
    }
})
