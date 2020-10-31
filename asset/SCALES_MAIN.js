let { scaleArray, scaleObject } = require("../lib/CommonFuncs");
let config = storages.create("arkknights_configs");
let scale_ratio = config.get("scale_ratio");

/*
 * coord_battle:        “作战”按钮的坐标
 * coord_supplies       “物资筹备”的坐标
 * coord_chips          “芯片搜索”的坐标
 * coord_annihilation   “剿灭模式”的坐标
 * coord_event_1        活动1的坐标
 * coord_event_2        活动2的坐标
 * coords_episode       章节界面左滑的向量坐标
 * coords_episode_r     章节界面右滑的向量坐标
 * coords_operation     关卡界面左滑的向量坐标
 * coords_operation_r   关卡界面右滑的向量坐标
 * region_rewards       结算时显示材料的区域坐标
*/
module.exports = {
  "16:9": {
    coord_battle: scaleObject({ x: 1455, y: 232 }, scale_ratio),
    coord_supplies: scaleObject({ x: 352, y: 997 }, scale_ratio),
    coord_chips: scaleObject({ x: 577, y: 997 }, scale_ratio),
    coord_annihilation: scaleObject({ x: 802, y: 997 }, scale_ratio),
    coord_event_1: scaleObject({ x: 1267, y: 997 }, scale_ratio),
    coord_event_2: scaleObject({ x: 1492, y: 997 }, scale_ratio),
    coords_episode: scaleObject({ x1: 1344, y1: 540, x2: 576, y2: 540 }, scale_ratio),
    coords_episode_r: scaleObject({ x1: 576, y1: 540, x2: 1344, y2: 540 }, scale_ratio),
    coords_operation: scaleObject({ x1: 997, y1: 864, x2: 922, y2: 864 }, scale_ratio),
    coords_operation_r: scaleObject({ x1: 922, y1: 864, x2: 997, y2: 864 }, scale_ratio),
    region_rewards: scaleArray([690, 765, 1230, 225], scale_ratio),
  },
  "20:9": {
    coord_battle: scaleObject({ x: 1830, y: 240 }, scale_ratio),
    coord_supplies: scaleObject({ x: 350, y: 990 }, scale_ratio),
    coord_chips: scaleObject({ x: 580, y: 990 }, scale_ratio),
    coord_annihilation: scaleObject({ x: 810, y: 990 }, scale_ratio),
    coord_event_1: scaleObject({ x: 1260, y: 990 }, scale_ratio),
    coord_event_2: scaleObject({ x: 1490, y: 990 }, scale_ratio),
    coords_episode: scaleObject({ x1: 1920, y1: 540, x2: 480, y2: 540 }, scale_ratio),
    coords_episode_r: scaleObject({ x1: 480, y1: 540, x2: 1920, y2: 540 }, scale_ratio),
    coords_operation: scaleObject({ x1: 1100, y1: 864, x2: 1300, y2: 864 }, scale_ratio),
    coords_operation_r: scaleObject({ x1: 1300, y1: 864, x2: 1100, y2: 864 }, scale_ratio),
    region_rewards: scaleArray([700, 770, 1700, 230], scale_ratio),
  },
};