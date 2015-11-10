/**
 * Created by DELL on 2015/11/10.
 */
var WordLayer = cc.Layer.extend({
    _map : null,
    _flagList : [],
    ctor : function() {
        this._super();
        this._flagList = [];     //必须清空数组
        this._init();
    },
    _getMission : function() {
        //获取关卡信息，插旗
        var arr = GameMission.getData();    //关卡信息
        var len = arr.length;
        var texture = {
            "pass" : cc.textureCache.addImage("res/SelectSceen/flag.png"),
            "normal" : cc.textureCache.addImage("res/SelectSceen/flag1.png")
        };                //创建图片纹理
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
            /*之后再添加时间监听函数*/
            this._flagList.push(cur_flag);
        }
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
WordLayer.prototype.backToIndex = function() {
    console.log("回到首页");
    cc.director.runScene(new cc.TransitionPageTurn(0.5, new StartScene()));
};
WordLayer.prototype.heroHome = function() {
    console.log("进入英雄大厅");
};