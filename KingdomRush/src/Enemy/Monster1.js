/**
 * Created by DELL on 2015/11/17.
 */
var Monster1 = MonsterBase.extend({
    _posArr : [],
    _speed : 0.4,         //速度
    _tick : 1,            //移动位置跳数
    ctor : function() {
        this._super("res/Enemy/monster1.plist", "res/Enemy/monster1.png", "#m1-x-walk1.png", "m1");
    },
    setPos : function(arr) {
        var offy = Math.round(10 - Math.random() * 20); //Y坐标随机错开
        for(var i = 0; i < arr.length; i++) {
            arr[i][1] += offy;
            this._posArr.push(arr[i]);
        }
        this.attr({
            "x" : this._posArr[0][0],
            "y" : this._posArr[0][1]
        });
        this._nextPos = cc.p(this._posArr[1][0], this._posArr[1][1]);    //下一站
        this.setAngle();
    },
    checkPos : function() {
        var disX = Math.abs(this.x - this._nextPos.x),
            disY = Math.abs(this.y - this._nextPos.y);
        var distance = Math.sqrt(disX * 2 + disY * 2);
        if(distance < 1) {
            this._tick++;
            if(this._posArr[this._tick]) {
                this._nextPos = cc.p(this._posArr[this._tick][0], this._posArr[this._tick][1]);   //改变下一跳
                this.setAngle();
            }
        }
    },
    move : function() {
        var disX = this._nextPos.x - this.x,
            disY = this._nextPos.y - this.y;
        var angle = Math.atan2(disY, disX);
        this.x += this._speed * Math.cos(angle);
        this.y += this._speed * Math.sin(angle);
        this.checkPos();
    },
    setAngle : function() {
        var disX = this._nextPos.x - this.x,
            disY = this._nextPos.y - this.y;
        var angle = Math.atan(disY / disX);

        var _angle = (angle * 180) / Math.PI;
        if(_angle < 0) {
            _angle += 180;
        }

        
        var nextY = this._nextPos.y;
        var curY = this.y;

        if(_angle <=60 && nextY > curY) {
            this.changeWalkState("go_right");
            console.log("向右走");
        }
        if(_angle <=60 && nextY < curY) {
            this.changeWalkState("go_left");
            console.log("向左走");
        }
        if(_angle > 60 && _angle < 120 && nextY > curY) {
            this.changeWalkState("go_back");
            console.log("向上走");
        }
        if(_angle > 60 && _angle < 120 && nextY < curY) {
            this.changeWalkState("go_front");
            console.log("向下走");
        }
        if(_angle >= 120 && nextY > curY) {
            this.changeWalkState("go_left");
            console.log("向左走");
        }
        if(_angle >= 120 && nextY < curY) {
            this.changeWalkState("go_right");
            console.log("向右走");
        }
        if(_angle == 0 && this._nextPos.x < this.x) {
            this.changeWalkState("go_left");
            console.log("向左走");
        }
        if(_angle == 0 && this._nextPos.x > this.x) {
            this.changeWalkState("go_right");
            console.log("向右走");
        }
    }
});