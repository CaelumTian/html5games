/**
 * Created by DELL on 2015/11/7.
 */

var SelectScene = cc.Scene.extend({
    _layer : null,
    onEnter : function() {
        this._super();     //关卡选择场景
        var layer = this._layer = loadAsync(resSelectScene);     //加载关卡选择场景
        this.addChild(layer, 2);
        layer.initWithResources(resSelectScene, this._init, this);
    },
    _init : function(target) {
        var self = target;
        console.log("执行回调函数了");
        var layer = new WordLayer();
        self.addChild(layer, 1);
    }
});
