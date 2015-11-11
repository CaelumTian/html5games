/**
 * Created by DELL on 2015/11/10.
 */
var WordLayer = cc.Layer.extend({
    _map : null,
    _flagList : [],
    _panel : null,
    _panelState : true,
    _currMission : undefined,
    ctor : function() {
        this._super();
        this._flagList = [];     //必须清空数组
        this._panel = null;
        this._panelState = true;
        this._currMission = undefined;
        this._init();
    },
    _getMission : function() {
        //获取关卡信息，插旗
        var self = this;
        var arr = GameMission.getData();    //关卡信息
        var len = arr.length;
        var texture = {
            "pass" : cc.textureCache.addImage("res/SelectSceen/flag.png"),
            "normal" : cc.textureCache.addImage("res/SelectSceen/flag1.png")
        };                //创建图片纹理

        //事件监听主体
        var flagListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            swallowTouches: true,
            onMouseDown : function(event) {
                var target = event.getCurrentTarget();
                //获取触摸点相对于按钮所在的坐标
                var locationNode = target.convertToNodeSpace(event.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect, locationNode)) {
                    if(self._panelState) {
                        self._currMission = target.id + 1;
                        self._initPanel();
                    }
                    return true;
                }
                return false;
            }
        });

        for(var i = 0; i < len; i++) {
            var ispass = arr[i]["ispass"],
                texturename = ispass ? texture["pass"] : texture["normal"],
                cur_flag = new cc.Sprite(texturename);
            cur_flag.id = i;
            cur_flag.attr({
                "x" : arr[i]["xpos"],
                "y" : arr[i]["ypos"] + 30,
                "opacity" : 0
            });

            cc.eventManager.addListener(flagListener.clone(), cur_flag);
            this._flagList.push(cur_flag);
        }
        /*放置所有旗帜*/
        for(var i = 0, j = this._flagList.length; i < j; i++) {
            var curr = this._flagList[i];
            var flagAction1 = cc.fadeIn(0.3, 255),
                flagAction2 = cc.moveTo(0.3, cc.p(curr.x, curr.y - 30));
            var delayAction = cc.delayTime(i * 0.1 + 1);
            curr.runAction(cc.sequence(
                delayAction,
                flagAction1,
                flagAction2
            ));
            this.addChild(curr);
        }
    },
    onExit : function() {
        console.log("图层被执行了");
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
WordLayer.prototype._init = function() {
    var centerX = cc.winSize.width / 2,
        centerY = cc.winSize.height / 2;
    this._map = new cc.Sprite("res/SelectSceen/map.jpg");
    this.addChild(this._map);

    var backToIndex = new cc.MenuItemImage("res/SelectSceen/backToIndex.png", "res/SelectSceen/backToIndex.png", "res/SelectSceen/backToIndex.png", this.backToIndex, this),
        backButton = new cc.Menu(backToIndex);    //110,50

    var heroHome = new cc.MenuItemImage("res/SelectSceen/heroIcon.png", "res/SelectSceen/heroIcon.png", "res/SelectSceen/heroIcon.png", this.heroHome, this),
        heroButton = new cc.Menu(heroHome);

    backButton.attr({
        "x" : 110,
        "y" : -60
    });
    heroButton.attr({
        "x" : 680,
        "y" : -60
    });

    backButton.runAction(cc.sequence(
        cc.delayTime(1),
        cc.moveTo(0.5, cc.p(110, 50)).easing(cc.easeInOut(2))
    ));
    heroButton.runAction(cc.sequence(
        cc.delayTime(1),
        cc.moveTo(0.5, cc.p(680, 63)).easing(cc.easeInOut(2))
    ));
    this._map.attr({
        "x" : centerX,
        "y" : centerY
    });

    this.addChild(backButton);
    this.addChild(heroButton);
    this._getMission();
};
WordLayer.prototype._initPanel = function() {
    var centerX = cc.winSize.width / 2,
        centerY = cc.winSize.height / 2;
    var panel = this._panel = new cc.Sprite("res/SelectSceen/gkxz.png");    //关卡选择精灵
    var gushi = new cc.MenuItemImage("res/SelectSceen/gushimoshi.png", "res/SelectSceen/gushimoshi.png", "res/SelectSceen/gushimoshi.png", this._enterTask, this),
        gushiButton = new cc.Menu(gushi);
    var wujin = new cc.MenuItemImage("res/SelectSceen/wujinmoshi.png", "res/SelectSceen/wujinmoshi.png", "res/SelectSceen/wujinmoshi.png", this._enterWujin, this),
        wujinButton = new cc.Menu(wujin);

    var cancel = new cc.MenuItemImage("res/SelectSceen/xx.png", "res/SelectSceen/xx.png", "res/SelectSceen/xx.png", this._closePanel, this),
        cancelButton = new cc.Menu(cancel);

    var missionFont = new cc.LabelBMFont(this._currMission, "res/SelectSceen/NumFontda.fnt", 70, cc.TEXT_ALIGNMENT_CENTER);

    cancelButton.attr({
        "x" : 286,
        "y" : 240
    });
    missionFont.attr({
        "x" : 163,
        "y" : 242
    });
    gushiButton.attr({
        "x" : 163,
        "y" : 117
    });
    wujinButton.attr({
        "x" : 163,
        "y" : 55
    });

    panel.addChild(cancelButton);
    panel.addChild(missionFont);
    panel.addChild(gushiButton);
    panel.addChild(wujinButton);
    panel.attr({
        "x" : centerX,
        "y" : centerY,
        "scaleX" : 0.1,
        "scaleY" : 0.1
    });

    panel.runAction(cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut(2)));
    this.addChild(panel);
    this._panelState = false;
};
WordLayer.prototype._closePanel = function() {
    console.log("关闭界面");
    var self = this;
    function deletePanel() {
        this._panel.removeFromParent();    //删除本节点
        this._panel = null;
    }
    this._panel.runAction(cc.sequence(
        cc.scaleTo(0.3, 0.1, 0,1),
        cc.callFunc(deletePanel, self)
    ));
    this._panelState = true;
};
WordLayer.prototype._enterTask = function() {
    console.log("切换到gamescene场景");
    cc.director.runScene(new GameScene(this._currMission));
};
WordLayer.prototype.backToIndex = function() {
    console.log("回到首页");
    cc.director.runScene(new cc.TransitionPageTurn(0.5, new StartScene()));
};
WordLayer.prototype.heroHome = function() {
    console.log("进入英雄大厅");
};