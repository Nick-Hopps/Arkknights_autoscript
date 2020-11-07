let { readImageBase64 } = require("../lib/CommonFuncs");
let raw = JSON.parse(files.read(files.path("asset/IMAGES_MATERIAL.json")));
let event = JSON.parse(files.read(files.path("asset/IMAGES_EVENT.json")));
let config = storages.create("arkknights_configs");
let scale_ratio = config.get("scale_ratio");

module.exports = {
  // 活动材料
  events: {
    // "活动材料XX":  readImageBase64(event["活动材料XX"], scale_ratio),
  },
  // 芯片
  chips: {
    "重装芯片": readImageBase64(raw["重装芯片"], scale_ratio),
    "医疗芯片": readImageBase64(raw["医疗芯片"], scale_ratio),
    //"狙击芯片": readImageBase64(raw["狙击芯片"], scale_ratio),
    //"术师芯片": readImageBase64(raw["术师芯片"], scale_ratio),
    //"先锋芯片": readImageBase64(raw["先锋芯片"], scale_ratio),
    //"辅助芯片": readImageBase64(raw["辅助芯片"], scale_ratio),
    "近卫芯片": readImageBase64(raw["近卫芯片"], scale_ratio),
    "特种芯片": readImageBase64(raw["特种芯片"], scale_ratio),
  },
  // 芯片组
  chip_packs: {
    //"重装芯片组": readImageBase64(raw["重装芯片组"], scale_ratio),
    //"医疗芯片组": readImageBase64(raw["医疗芯片组"], scale_ratio),
    "狙击芯片组": readImageBase64(raw["狙击芯片组"], scale_ratio),
    "术师芯片组": readImageBase64(raw["术师芯片组"], scale_ratio),
    //"先锋芯片组": readImageBase64(raw["先锋芯片组"], scale_ratio),
    //"辅助芯片组": readImageBase64(raw["辅助芯片组"], scale_ratio),
    //"近卫芯片组": readImageBase64(raw["近卫芯片组"], scale_ratio),
    //"特种芯片组": readImageBase64(raw["特种芯片组"], scale_ratio),
  },
  // 主要材料
  main: {
    // 2级材料
    t2: {
      "固源岩": readImageBase64(raw["固源岩"], scale_ratio),
      "糖": readImageBase64(raw["糖"], scale_ratio),
      "酮凝集": readImageBase64(raw["酮凝集"], scale_ratio),
      "异铁": readImageBase64(raw["异铁"], scale_ratio),
      "装置": readImageBase64(raw["装置"], scale_ratio),
    },
    // 3级材料
    t3: {
      "固源岩组": readImageBase64(raw["固源岩组"], scale_ratio),
      "扭转醇": readImageBase64(raw["扭转醇"], scale_ratio),
      "轻锰矿": readImageBase64(raw["轻锰矿"], scale_ratio),
      "全新装置": readImageBase64(raw["全新装置"], scale_ratio),
      "糖组": readImageBase64(raw["糖组"], scale_ratio),
      "酮凝集组": readImageBase64(raw["酮凝集组"], scale_ratio),
      "研磨石": readImageBase64(raw["研磨石"], scale_ratio),
      "异铁组": readImageBase64(raw["异铁组"], scale_ratio),
    },
  }
};
