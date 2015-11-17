/**
 * Created by CaelumTian on 2015/11/11.
 */

var monster = null;
var GameScene = cc.Scene.extend({
    _gameData : null,
    _count : 0,                 //怪物计数器
    _tick : 0,                  //攻击波数
    _monster : null,            //怪物请做成数组
    ctor : function(num) {
        this._super();
        var self = this;
        console.log("当前关卡：" + num);

        var layer = new AsyncLayer();     //加载关卡选择场景
        this.addChild(layer, 2);
        cc.loader.loadJson("res/Mission/mission" + num + ".json", function(err, result) {
            if(err) {
                throw new Error("关卡数据加载错误");
            }
            self._gameData = result;
            layer.initWithResources(result["res"], self._init, self);
        });
    },
    _init : function(target) {
        var self = target;
        self._setMap();
        self._setMonster();
        self.scheduleUpdate();
    },
    update : function() {
        this.monster.move();
    },
    _setMonster : function() {
        var arr = this._gameData["roadArr"][0];   //路经坐标
        monster = this.monster = new Monster1();
        this.monster.setPos(arr);
        this.addChild(this.monster);
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
    },
    onExit : function() {
        console.log("这里被执行了");
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
