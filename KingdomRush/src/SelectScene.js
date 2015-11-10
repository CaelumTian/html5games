/**
 * Created by DELL on 2015/11/7.
 */

var SelectScene = cc.Scene.extend({
    onEnter : function() {
        this._super();     //关卡选择场景
        var layer = new AsyncLayer();     //加载关卡选择场景
        this.addChild(layer, 2);
        layer.initWithResources(resSelectScene, this._init, this);
    },
    _init : function(target) {
        var self = target;
        console.log("执行回调函数了");
        var layer = new WordLayer();
        self.addChild(layer, 1);
    },
    onExit : function() {
        console.log("这里被执行了");
        this.removeAllChildren();          //切换场景前移除所有节点
    }
});
