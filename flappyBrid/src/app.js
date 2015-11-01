var MainScreen = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var mainUI = ccs.load("res/MainUi/MainScreen.json");   //加载json格式文件
        this.addChild(mainUI.node);    //添加node
        var button = ccui.helper.seekWidgetByName(mainUI.node, "Button_2"),
            title = ccui.helper.seekWidgetByName(mainUI.node, "title_6"),
            ground = ccui.helper.seekWidgetByName(mainUI.node, "ground_8"),
            bg = ccui.helper.seekWidgetByName(mainUI.node, "bg_2");  //开始按钮
        /*管道动画*/
        var action1 = cc.moveBy(1, cc.p(-(ground.width - cc.winSize.width), 0)),
            action2 = cc.moveBy(0, cc.p(ground.width - cc.winSize.width, 0)),
            sequence = cc.sequence(action1, action2);
        ground.runAction(cc.repeatForever(sequence));

        var animation = new cc.Animation();

        button.addClickEventListener(function(btn, type) {
            cc.director.runScene(new cc.TransitionFade(1, new GameScreen()));
        })
        var birdSprite = new FlappyBird();
        console.log(birdSprite);
        birdSprite.x = 317;
        birdSprite.y = 430;
        this.addChild(birdSprite);
    }
})
var GameScreen = cc.Scene.extend({
    onEnter : function() {
        this._super();
        this.addChild(new GameLayer());
    }
})



