/**
 * Created by DELL on 2015/11/24.
 */
var LifeBar = cc.Sprite.extend({
    _bg : null,
    _bar : null,
    ctor : function() {
        this._super();
        this.init();
    },
    init : function() {
        var bg = this._bg = new cc.Sprite("res/Enemy/lifeBarBg.png"),
            bar = this._bar = new cc.Sprite("res/Enemy/lifeBar.png");
        this.addChild(bg, 1);
        this.addChild(bar, 2);
        bar.setAnchorPoint(0, 0.5);
        bar.attr({
            "x" : -18 / 2,
            "y" : 0
        });
        this._bar.setTextureRect(cc.rect(0, 0, 18, 2));
    },
    setProgress : function(hp, life) {
        var num = 18 * hp / life;
        var per = num < 0 ? 0 : num;
        this._bar.setTextureRect(cc.rect(0, 0, per, 2));
    },
    reset : function() {
        this._bar.setTextureRect(cc.rect(0, 0, 18, 2));
    }
});