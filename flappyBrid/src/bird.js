/**
 * Created by CaelumTian on 2015/10/31.
 * 小鸟类
 */
var FlappyBird = cc.Sprite.extend({
    _animation : null,
    ctor : function(layer) {
        cc.spriteFrameCache.addSpriteFrames("res/bird.plist");
        cc.SpriteBatchNode.create("res/bird.png");
        this._super("#bird-1.png");
        this.init(layer);
    },
    init : function(layer) {
        this._animation = new cc.Animation();
        for(var i = 0; i < 3; i++) {
            var str = "bird-" + (i + 1) + ".png";
            this._animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(str));
        }
        this._animation.setDelayPerUnit(0.1);
        var action = cc.animate(this._animation).repeatForever();
        this.runAction(action);
    }

})