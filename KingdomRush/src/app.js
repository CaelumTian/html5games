var StartScene = cc.Scene.extend({
    onEnter : function() {
        this._super();
        var role = new cc.NodeGrid();
        var bg = new cc.Sprite("res/penda.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        role.addChild(bg);

        this.addChild(role);
        console.log(role.getPosition());


        role.runAction(cc.sequence(
            cc.shaky3D(1, cc.size(50, 50), 5, false),
            cc.shuffleTiles(1, cc.size(50, 50), 25)
        ));
    }
})

