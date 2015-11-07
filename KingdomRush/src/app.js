// 准备开始场景
var StartScene = cc.Scene.extend({
    _bg : null,
    _logo : null,
    _linkChain : null,
    onEnter : function() {
        this._super();
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2;       //屏幕中心点

        var bg = this._bg = new cc.Sprite("res/StartGame/welbg.jpg"),
            logo = this._logo = new cc.Sprite("res/StartGame/wellogo.png");    //背景精灵

        /*背景动画*/
        bg.attr({
            "opacity" : 0,
            "x" : centerX,
            "y" : centerY
        });
        var bgAction = cc.fadeIn(0.8, 255);      //淡入0.8s
        bg.runAction(cc.sequence(
            cc.delayTime(0.5),
            bgAction
        ));
        this.addChild(bg);

        /*logo动画*/
        logo.attr({
            "x" : cc.winSize.width,
            "y" : cc.winSize.height + logo.height,
            "scaleX" : 0.1,                     //横向缩放
            "rotation" : 40                     //旋转40
        });
        var logoFadeIn1 = cc.moveTo(0.2, cc.p(centerX, 310)).easing(cc.easeOut(2)),
            logoFadeIn2 = cc.scaleTo(0.2, 1, 1).easing(cc.easeOut(2)),
            logoFadeIn3 = cc.rotateTo(0.2, 0).easing(cc.easeOut(2)),
            logoFadeIn = cc.sequence(
                cc.delayTime(1.3),
                cc.spawn(
                    logoFadeIn1,
                    logoFadeIn2,
                    logoFadeIn3
                )
            );
        var logoShake1 = cc.scaleTo(0.1, 0.9, 0.9),
            logoShake2 = cc.scaleTo(0.1, 1, 1),
            logoShake3 = cc.scaleTo(0.1, 1.1, 1.1),
            logoShake4 = cc.scaleTo(0.1, 1, 1),
            logoShake = cc.sequence(
                logoShake1,
                logoShake2,
                logoShake3,
                logoShake4
            );
        var logoAction = cc.sequence(
            logoFadeIn,
            logoShake,
            cc.callFunc(this.nextAnimation, this)
        );
        logo.runAction(logoAction);
        this.addChild(logo, 3);
    },
    /*链条动画*/
    nextAnimation : function() {
        console.log("动作结束");
        var self = this;
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2;

        var linkChain = this._linkChain = new cc.Sprite("res/StartGame/linkChain.png");    //链条图片
        var startMenu = new cc.MenuItemImage("res/StartGame/welbtn.png", "res/StartGame/welbtn.png", "res/StartGame/welbtn.png", this.startGame, this),
            startButton = new cc.Menu(startMenu);

        linkChain.attr({
            "x" : centerX,
            "y" : 200
        });
        startButton.attr({
            "x" : linkChain.width / 2,
            "y" : linkChain.height / 2 - 30,
            "width" : 199,
            "height" : 100
        });
        linkChain.addChild(startButton);     //插入linkChain节点
        var linkFall = cc.moveBy(0.6, 0, -60).easing(cc.easeBounceOut(2));                 //链条动画
        linkChain.runAction(cc.sequence(
            linkFall
        ));
        this.addChild(linkChain, 2);     //在logo之下 2 层级
    },
    startGame : function() {
        console.log("游戏开始...加载资源");
        cc.director.runScene(new SelectScene());     //切换关卡选择场景
    }
})

