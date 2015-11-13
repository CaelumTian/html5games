/**
 *   怪物的有限状态机
 *   0 => idleState : 闲置状态
 *   1 => moveState : 移动状态
 *   2 => moveEndState : 移动结束状态
 *   3 => fightState : 攻击状态
 *   4 => fightEndState : 攻击结束状态
 *   5 => deadState : 死亡状态
 *   6 => deadEndState : 死亡结束状态
 */

var stateType = {
    "0" : "idleState",
    "1" : "moveState",
    "2" : "moveEndState",
    "3" : "fightState",
    "4" : "fightEndState",
    "5" : "deadState",
    "6" : "deadEndState"
};
var StateMachine = (function() {
    function StateMachine(obj) {
        this._obj = obj;          //传入哪个对象使用的状态机
        this._curState;           //当前状态
    }
    StateMachine.prototype.changeState = function(state) {
        this._curState = state;
    };
    StateMachine.prototype.onEnterFrame = function() {
        switch (this._curState) {
            case 0 :                  /* idleState */
                if (this._obj.isIdle()) {
                    this._obj.idling();
                }
                break;
            case 1 :                 /* moveState */
                if (this._obj.isMove()) {
                    this._obj.moving();
                }
                break;
            case 2 :                /* moveEndState */
                this._obj.movingEnd();
                break;
            case 3 :                /* fightState */
                if (this._obj.isFighting()) {
                    this._obj.fighting();
                }
                break;
            case 4 :               /* fightEndState */
                this._obj.fightingEnd();
                break;
            case 5 :               /* deadState */
                if (this._obj.isDead()) {
                    this._obj.dying();
                }
                break;
            case 6 :              /* deadEndState */
                this._obj.dyingEnd();
                break;
            default:
                break;
        }
    };
    Object.defineProperty(StateMachine.prototype, "curState", {
        /**当前状态读取器*/
        get: function () {
            console.log("获取状态");
            return this._curState;
        },
        enumerable: true,
        configurable: true
    });
    return StateMachine;
})();
