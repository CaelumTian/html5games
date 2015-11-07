/**
 * Created by DELL on 2015/11/7.
 */

var SelectScene = cc.Scene.extend({
    _layer : null,
    onEnter : function() {
        this._super();     //关卡选择场景
        var layer = this._layer = loadAsync(resSelectScene);     //加载关卡选择场景
        this.addChild(layer);
        layer.initWithResources(resSelectScene);
    }
});
