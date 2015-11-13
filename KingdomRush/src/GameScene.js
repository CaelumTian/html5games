/**
 * Created by CaelumTian on 2015/11/11.
 */
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
            console.log(result);
            self._gameData = result;
            layer.initWithResources(currRes, self._init, self);
        });
    },
    _init : function(target) {
        var self = target,
            gameData = target._gameData;
        console.log("执行回调函数了");
        console.log("关卡数据");
    },
    onExit : function() {
        console.log("这里被执行了");
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
