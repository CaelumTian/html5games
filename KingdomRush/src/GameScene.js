/**
 * Created by CaelumTian on 2015/11/11.
 */
var GameScene = cc.Scene.extend({
    ctor : function(num) {
        this._super();
        console.log("当前关卡：" + num);
        var currRes = [];
        var layer = new AsyncLayer();     //加载关卡选择场景
        this.addChild(layer, 2);
        layer.initWithResources(resSelectScene, this._init, this);
    },
    _init : function(target) {
        var self = target;
        console.log("执行回调函数了");
    },
    onExit : function() {
        console.log("这里被执行了");
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
