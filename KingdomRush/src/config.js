/**
 * Created by DELL on 2015/11/7.
 */

/*关卡选择场景数据*/
var resSelectScene = [
    "res/SelectSceen/backToIndex.png",       //回到首页图片
    "res/SelectSceen/flag.png",
    "res/SelectSceen/gkxz.png",
    "res/SelectSceen/gushimoshi.png",
    "res/SelectSceen/heroIcon.png",
    "res/SelectSceen/map.jpg",
    "res/SelectSceen/wujinmoshi.png"
];

/*关卡数据界面*/
var GameMission = (function() {
    function GameMission() {
    }
    GameMission.getData = function () {
        return GameMission.data;
    };
    /**所有关卡当前状态(小旗旗)*/
    GameMission.data = [
        { "xpos": 250, "ypos": 80, "ispass": false },
        { "xpos": 325, "ypos": 102, "ispass": false },
        { "xpos": 325, "ypos": 162, "ispass": false },
        { "xpos": 250, "ypos": 188, "ispass": false },
        { "xpos": 140, "ypos": 225, "ispass": false },
        { "xpos": 270, "ypos": 344, "ispass": false },
        { "xpos": 427, "ypos": 274, "ispass": false },
        { "xpos": 505, "ypos": 370, "ispass": false },
        { "xpos": 603, "ypos": 320, "ispass": false },
        { "xpos": 550, "ypos": 238, "ispass": false },
        { "xpos": 490, "ypos": 188, "ispass": false },
        { "xpos": 480, "ypos": 96, "ispass": false }
    ];
    return GameMission;
})();