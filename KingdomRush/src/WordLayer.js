/**
 * Created by DELL on 2015/11/10.
 */
var WordLayer = cc.Layer.extend({
    _map : null,
    ctor : function() {
        this._super();
        this._init();
    }
});
WordLayer.prototype._init = function() {
    var centerX = cc.winSize.width / 2,
        centerY = cc.winSize.height / 2;
    this._map = new cc.Sprite("res/SelectSceen/map.jpg");
    this._map.attr({
        "x" : centerX,
        "y" : centerY
    });
    this.addChild(this._map);
};