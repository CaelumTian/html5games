/**
 * 用于异步加载页面资源的单例类
 * initWidthResources 用于设置请求资源。参数：
 *          res ： Array
 * _cb为请求资源完毕后的回调函数
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
    _loadHeight : 0,
    _obj : null,           //保存舞台this的引用(有没有更好的方法)
    ctor : function() {
        this._super();
        this._loadbgl = new cc.Sprite(res.loadbg);
        this._loadbgr = new cc.Sprite(res.loadbg);    //右侧图片
        this._loadl = new cc.Sprite(res.loadl);
        this._loadr = new cc.Sprite(res.loadr);
        this._loadbartop = new cc.Sprite(res.loadbartop);
        this._loadbarbg = new cc.Sprite(res.loadbarbg);        //加载loading场景所需全部资源
        this._loadLength = this._loadbartop.width;            //进度条长度
        this._loadHeight = this._loadbartop.height;
        this.init();
    },
    init : function() {
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2,
            bgWidth = this._loadbgl.width,
            bgHeight = this._loadbgl.height;

        this._loadbgl.setAnchorPoint(1, 0.5);
        this._loadbgl.attr({
            "x" : 0,
            "y" : centerY
        });

        this._loadbgr.setAnchorPoint(1, 0.5);
        this._loadbgr.attr({
            "scaleX" : -1,
            "x" : cc.winSize.width,
            "y" : centerY
        });

        this._loadl.attr({
            "x" : bgWidth / 2,
            "y" : bgHeight / 2
        });
        this._loadr.attr({
            "x" : bgWidth / 2,
            "y" : bgHeight / 2,
            "scaleX" : -1                                        //轴对称
        });

        var bglAction = cc.moveTo(0.6, cc.p(centerX, centerY)).easing(cc.easeInOut(2)),
            bgrAction = cc.moveTo(0.6, cc.p(centerX, centerY)).easing(cc.easeInOut(2));    //动作不能合并，每个精灵对应一个动作，不能共享。


        this._loadbgl.addChild(this._loadl);
        this._loadbgr.addChild(this._loadr);

        this._loadbgr.runAction(bgrAction);
        this._loadbgl.runAction(bglAction);

        this.addChild(this._loadbgr);
        this.addChild(this._loadbgl);
    },
    initWithResources : function(res, cb, target) {
        var centerX = cc.winSize.width / 2,
            self = this,
            loadPosY = 100,
            loadBarBorder = 8,                                //8像素边框
            loadBarHeight = this._loadbarbg.height;
        self._res = res;                                      //设置资源数组
        self._cb = cb;
        self._obj = target;
        this._loadbarbg.attr({
            "x" : centerX,
            "y" : loadPosY,
            "opacity" : 0
        });

        this._loadbartop.setAnchorPoint(0, 0.5);

        this._loadbartop.attr({
            "x" : loadBarBorder,
            "y" : loadBarHeight / 2,                       //loading最上边
            "opacity" : 0
        });


        this._loadbartop.setTextureRect(cc.rect(0, 0, 0, this._loadHeight));

        this._loadbarbg.addChild(this._loadbartop);

        this._loadbartop.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.fadeIn(0.1, 255)
        ));

        var barfadeIn = cc.sequence(
            cc.delayTime(0.8),
            cc.fadeIn(0.1, 255),
            cc.callFunc(self._startLoading, self)         //调用加载函数
        ).easing(cc.easeInOut(2));

        this._loadbarbg.runAction(barfadeIn);
        this.addChild(this._loadbarbg);
    },
    _startLoading : function() {
        console.log("数据开始加载");
        var self = this,
            res = self._res;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100) / 100;
                //cc.rect貌似以左上角作为起点画出来的
                self._loadbartop.setTextureRect(cc.rect(0, 0, self._loadLength * percent, self._loadHeight));
                console.log(self._loadLength * percent);

            }, function () {
                if(!self._cb) {
                    throw new Error("没有回调函数");
                }
                console.log("数据加载完毕,开始调用回调函数");
                self._loadbartop.setTextureRect(cc.rect(0, 0, self._loadLength, self._loadHeight));
                self._cb(self._obj);                                     //回调舞台加载舞台元素
                self.hideLoadBar();
            });
    },
    hideLoadBar : function() {
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2,
            loadtopAction = cc.fadeOut(0.1),
            loadbgAction = cc.fadeOut(0.1),
            bglAction = cc.moveTo(0.6, cc.p(0, centerY)).easing(cc.easeInOut(2)),
            bgrAction = cc.moveTo(0.6, cc.p(cc.winSize.width, centerY)).easing(cc.easeInOut(2));
        this._loadbartop.runAction(loadtopAction);
        this._loadbarbg.runAction(loadbgAction);
        this._loadbgl.runAction(bglAction);
        this._loadbgr.runAction(cc.sequence(
            bgrAction,
            cc.callFunc(this.removeLoarLayer, this)                      //load层关闭后，删除层
        ));
    },
    removeLoarLayer : function() {
        this.removeFromParent();              //删除本layer
    },
    onExit : function() {
        this.removeAllChildren();
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