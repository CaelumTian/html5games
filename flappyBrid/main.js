cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    cc.view.enableRetina(false);

    cc.view.adjustViewPort(false);

    //cc.view.setDesignResolutionSize(375, 627, cc.ResolutionPolicy.SHOW_ALL);   不启动屏幕适配方案

    //cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MainScreen());
    }, this);
};
cc.game.run();