/**
 *  怪物基类
 */

var MonsterBase = cc.Sprite.extend({
    _fsm : null,
    _hp : null,                    //当前血量
    _life : null,                  //最大生命值
    _lifeBar : null,               //血条
    ctor : function() {
        this._super();
        this._fsm = new StateMachine(this);
    },
    init : function(plistRes, pngRes) {
        /*给这个精灵赋初值*/
        cc.spriteFrameCache.addSpriteFrames(plistRes);
        cc.SpriteBatchNode.create(pngRes);
    }
});