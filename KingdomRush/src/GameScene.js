/**
 * Created by CaelumTian on 2015/11/11.
 */
var monsterList = [];
var GameScene = cc.Scene.extend({
    _gameData : null,
    _count : 0,                 //怪物计数器
    _tick : 0,                  //攻击波数
    _monsterList : [],            //怪物请做成数组
    ctor : function(num) {
        this._super();
        var self = this;
        console.log("当前关卡：" + num);
        this._missionNum = num;
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
        for(var i = 0, cur; cur = this._monsterList[i++];) {
            cur.move();
        }
    },
    _setMonster : function() {
        var road = this._gameData["roadArr"];   //路经1坐标
        var enemyData = this._gameData["enemyData"][this._tick];     //敌人数据

        var count = enemyData["count"];
        var arr = [];
        for(var i = 0; i < count; i++) {
            var monster = new Monster1();
            monster._life = enemyData["life"];        //怪物血
            monster._speed = enemyData["maxSpeed"];   //怪物速度
            arr.push(monster);                        //构造怪物组
        }

        console.log(arr);
        var curr_time = 0;
        var roadLength = road.length;

        this.schedule(addEnemy, 1);
        function addEnemy() {
            if(curr_time < count) {
                var currEnemy = arr[curr_time],
                    currRoad = road[curr_time % roadLength];
                currEnemy.setPos(currRoad);
                this.addChild(currEnemy);              //插入怪物
                curr_time++;
                this._monsterList.push(currEnemy);     //添加怪物
            }else {
                monsterList = this._monsterList;
                this.unschedule(addEnemy);             //取消定时器
            }
        }
    },
    _setMap : function() {
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2;

        var map = new cc.Sprite("res/Map/map" + this._missionNum + ".jpg");
        map.attr({
            "x": centerX,
            "y": centerY
        });
        this.addChild(map);              //最优先加载地图

        var backToMaps = new cc.MenuItemImage("res/Mission/backToMaps.png", "res/Mission/backToMaps.png", "res/Mission/backToMaps.png", this._backToMaps, this);
        var backToMapsButton = new cc.Menu(backToMaps);
        backToMapsButton.attr({
            "x" : 757,
            "y" : cc.winSize.height + 36
        });
        backToMapsButton.runAction(cc.sequence(
            cc.delayTime(1),
            cc.moveTo(0.6, cc.p(757, 450)).easing(cc.easeInOut(2))
        ));
        var uiInfo = new cc.Sprite("res/Mission/uiinfo.png");
        uiInfo.attr({
            "x" : 96,
            "y" : cc.winSize.height + 54
        });
        uiInfo.runAction(cc.sequence(
            cc.delayTime(1),
            cc.moveTo(0.6, cc.p(96, 440))).easing(cc.easeInOut(2)
        ));
        this.addChild(backToMapsButton);
        this.addChild(uiInfo);
    },
    onExit : function() {
        console.log("这里被执行了");
        cc.spriteFrameCache.removeSpriteFrames();     //清除缓存池精灵
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
GameScene.prototype._backToMaps = function() {
    cc.director.runScene(new SelectScene());
};
