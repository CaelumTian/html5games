cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));


    cc.view.enableRetina(false);

    cc.view.adjustViewPort(true);

    //cc.view.setDesignResolutionSize(800, 480, cc.ResolutionPolicy.SHOW_ALL);

    cc.view.resizeWithBrowserSize(true);

    Loading.preload(g_resources, function () {     //修改预加载
        cc.director.runScene(new StartScene());
    }, this);
};
cc.game.run();