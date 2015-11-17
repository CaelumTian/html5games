/**
 *  怪物基类
 */

var MonsterBase = cc.Sprite.extend({
    _fsm : null,
    _hp : null,                    //当前血量
    _life : null,                  //最大生命值
    _lifeBar : null,               //血条
    _prefix : "",
    _walkF : null,
    _walkB : null,
    _walkX : null,
    _direct : "right",             //默认向右方式
    ctor : function(plistRes, pngRes, defaultImg, prefix) {
        cc.spriteFrameCache.addSpriteFrames(plistRes);
        cc.SpriteBatchNode.create(pngRes);
        this._super(defaultImg);
        this.init(plistRes, pngRes, prefix);
    },
    init : function(plistRes, pngRes, prefix) {
        /*给这个精灵赋初值 prefix前缀 "m1-" */
        this._prefix = prefix;
        this._walkB = new cc.Animation();
        this._walkF = new cc.Animation();
        this._walkX = new cc.Animation();
        for(var i = 0; i < 12; i++) {
            var walkF = prefix + "-f-walk" + (i + 1) + ".png",
                walkB = prefix + "-b-walk" + (i + 1) + ".png",
                walkX = prefix + "-x-walk" + (i + 1) + ".png";
            this._walkF.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(walkF));
            this._walkB.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(walkB));
            this._walkX.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(walkX));
        }
    }
});
MonsterBase.prototype.changeWalkState = function(state) {
    var animate = null;
    switch(state) {
        case "go_right" :
            this.stopAllActions();
            if(this._direct === "left") {
                this.scaleX = 1;
                this._direct = "right";
            }
            this._walkX.setDelayPerUnit(1 / 12);
            animate = cc.animate(this._walkX).repeatForever();
            break;
        case "go_left" :
            this.stopAllActions();
            if(this._direct === "right") {
                this.scaleX = -1;
                this._direct = "left";
            }
            this._walkX.setDelayPerUnit(1 / 12);
            animate = cc.animate(this._walkX).repeatForever();
            break;
        case "go_back" :
            this.stopAllActions();
            this._walkB.setDelayPerUnit(1 / 12);    //顺序不能颠倒
            animate = cc.animate(this._walkB).repeatForever();
            break;
        case "go_front" :
            this.stopAllActions();
            this._walkF.setDelayPerUnit(1 / 12);
            animate = cc.animate(this._walkF).repeatForever();
            break;
        case "stop" :
            this.stopAllActions();
            return false;
        default :
            throw new Error("状态切换错误");
            break;
    }
    this.runAction(animate);
};