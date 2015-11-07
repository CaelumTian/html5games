/**
 * Created by DELL on 2015/11/6.
 */
var AsyncLayer = cc.Layer.extend({
    _loadbgl : null,
    _loadbgr : null,
    _loadl : null,
    _loadr : null,
    _loadbartop : null,
    _loadbarbg : null,
    _cb : null,               //回调函数
    _res : [],
    _loadLength : 0,
    ctor : function() {
        this._super();
        this._loadbgl = new cc.Sprite(res.loadbg);
        this._loadbgr = new cc.Sprite(res.loadbg);    //右侧图片
        this._loadl = new cc.Sprite(res.loadl);
        this._loadr = new cc.Sprite(res.loadr);
        this._loadbartop = new cc.Sprite(res.loadbartop);
        this._loadbarbg = new cc.Sprite(res.loadbarbg);        //加载loading场景所需全部资源
        this.init();
    },
    init : function() {
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2;

        this._loadbgl.setAnchorPoint(1, 0.5);
        this._loadbgl.attr({
            "x" : 0,
            "y" : centerY
        });
        var bglAction = cc.moveTo(0.6, cc.p(centerX, centerY)).easing(cc.easeInOut(2));


        this._loadbgr.setAnchorPoint(1, 0.5);
        this._loadbgr.attr({
            "scaleX" : -1,
            "x" : cc.winSize.width,
            "y" : centerY
        });

        var bgrAction = cc.moveTo(0.6, cc.p(centerX, centerY)).easing(cc.easeInOut(2));

        this._loadl.attr({
            "x" : 200,
            "y" : 240
        });
        this._loadr.attr({
            "x" : 200,
            "y" : 240,
            "scaleX" : -1
        });


        this._loadbgl.addChild(this._loadl);
        this._loadbgr.addChild(this._loadr);

        this._loadbgr.runAction(bgrAction);
        this._loadbgl.runAction(bglAction);

        this.addChild(this._loadbgr);
        this.addChild(this._loadbgl);
    },
    initWithResources : function(res) {
        console.log("这里发生变化");
        var self = this;
        self._res = res;                                      //资源数组

        this._loadbarbg.attr({
            "x" : cc.winSize.width / 2,
            "y" : 100,
            "opacity" : 0
        });

        var barfadeIn = cc.sequence(
            cc.delayTime(0.8),
            cc.fadeIn(0.1, 255),
            cc.callFunc(self._startLoading, self)         //调用加载函数
        ).easing(cc.easeInOut(2));

        this._loadbartop.setAnchorPoint(0, 0.5);          //右边为锚点

        this._loadLength = this._loadbartop.width;       //进度条长度

        this._loadbartop.attr({
            "x" : 8,                                      //8像素边框
            "y" : this._loadbarbg.height / 2,              //loading最上边
            "opacity" : 0
        });

        this._loadbartop.setTextureRect(cc.rect(308, 91, 0, 18), false, cc.size(182, 18));

        this._loadbarbg.addChild(this._loadbartop);

        this._loadbartop.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.fadeIn(0.1, 255)
        ));
        this._loadbarbg.runAction(barfadeIn);

        this.addChild(this._loadbarbg);
    },
    _startLoading : function() {
        console.log("数据开始加载")
        var self = this;
        var res = self._res;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100) / 100;
                console.log(percent);                                       //这里会计算百分比

                /*self._loadbartop.attr({
                    "x" : 8 + self._loadbartop.width * percent,
                    "y" : self._loadbarbg.height / 2
                });*/
                self._loadbartop.setTextureRect(cc.rect(308, 91, 182 * percent, 18), false, cc.size(182, 18));
                console.log(self._loadLength * percent);

            }, function () {
                /*self._loadbartop.attr({
                    "x" : 8 + self._loadbartop.width,
                    "y" : self._loadbarbg.height / 2
                });*/
                self._loadbartop.setTextureRect(cc.rect(308, 91, 182, 18), false, cc.size(182, 18));
                console.log("数据加载完毕");
                if (self._cb) {
                    self._cb.call();
                }
            });
    },
    showLoadBar : function() {

    },
    hideLoadBar : function() {

    }
});

//单例模式,用于加载某些资源
var loadAsync = (function() {
    var asyncLayer = null;
    return function(res) {
        if(asyncLayer === null) {
            asyncLayer = new AsyncLayer();   //创建单例
        }
        return asyncLayer;                   //返回该单例
    }
})();