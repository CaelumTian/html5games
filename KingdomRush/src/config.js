/**
 * Created by DELL on 2015/11/7.
 */

/*关卡选择场景数据*/
var resSelectScene = [
    "res/SelectSceen/backToIndex.png",       //回到首页图片
    "res/SelectSceen/flag.png",
    "res/SelectSceen/flag1.png",
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
        { "xpos": 267, "ypos": 379, "ispass": false },
        { "xpos": 341, "ypos": 351, "ispass": false },
        { "xpos": 343, "ypos": 294, "ispass": false },
        { "xpos": 265, "ypos": 243, "ispass": false },
        { "xpos": 131, "ypos": 226, "ispass": false },
        { "xpos": 270, "ypos": 125, "ispass": false },
        { "xpos": 430, "ypos": 189, "ispass": false },
        { "xpos": 521, "ypos": 81, "ispass": false },
        { "xpos": 643, "ypos": 152, "ispass": false },
        { "xpos": 564, "ypos": 225, "ispass": false },
        { "xpos": 517, "ypos": 283, "ispass": false },
        { "xpos": 497, "ypos": 360, "ispass": false }
    ];
    return GameMission;
})();