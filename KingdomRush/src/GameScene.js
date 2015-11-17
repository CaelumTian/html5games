/**
 * Created by CaelumTian on 2015/11/11.
 */

var monster = null;
var GameScene = cc.Scene.extend({
    _gameData : null,
    ctor : function(num) {
        this._super();
        var self = this;
        console.log("当前关卡：" + num);
        var currRes = [];

        var layer = new AsyncLayer();     //加载关卡选择场景
        this.addChild(layer, 2);
        cc.loader.loadJson("res/Mission/mission" + num + ".json", function(err, result) {
            if(err) {
                throw new Error("关卡数据加载错误");
            }
            self._gameData = result;
            currRes = result["res"];
            console.log(currRes);
            layer.initWithResources(currRes, self._init, self);
        });
    },
    _init : function(target) {
        var self = target,
            gameData = target._gameData;
        console.log("执行回调函数了");
        console.log("关卡数据");
        self._setMap();
    },
    _setMap : function() {
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2;

        var map = new cc.Sprite("res/Map/map1.jpg");
        map.attr({
            "x" : centerX,
            "y" : centerY
        });
        this.addChild(map);              //最优先加载地图

        var monster1 = new MonsterBase("res/Enemy/monster1.plist", "res/Enemy/monster1.png", "#m1-x-walk1.png", "m1");
        monster = monster1;
        monster1.attr({
            "x" : centerX,
            "y" : centerY
        });
        this.addChild(monster1);
        monster1.changeWalkState("go_back");
    },
    onExit : function() {
        console.log("这里被执行了");
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
