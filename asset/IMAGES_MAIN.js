let { readImageBase64 } = require("../lib/CommonFuncs");
let raw = JSON.parse(files.read(files.path("asset/IMAGES_MAIN.json")));
let event = JSON.parse(files.read(files.path("asset/IMAGES_EVENT.json")));
let config = storages.create("arkknights_configs");
let scale_ratio = config.get("scale_ratio");

module.exports = {
  // 活动相关（活动时自定义添加）
  //episode_event: readImageBase64(event.episode_event, scale_ratio),
  //operation_xx_xx: readImageBase64(event.operation_event_xx_xx, scale_ratio),
  // 游戏启动
  shape_enter: readImageBase64(raw.shape_enter, scale_ratio),
  start_arouse: readImageBase64(raw.start_arouse, scale_ratio),
  // 游戏主界面
  text_lv: readImageBase64(raw.text_lv, scale_ratio),
  ration_today: readImageBase64(raw.ration_today, scale_ratio),
  shape_dismiss: readImageBase64(raw.shape_dismiss, scale_ratio),
  // 主线章节
  episode_1: readImageBase64(raw.episode_1, scale_ratio),
  episode_2: readImageBase64(raw.episode_2, scale_ratio),
  episode_3: readImageBase64(raw.episode_3, scale_ratio),
  episode_4: readImageBase64(raw.episode_4, scale_ratio),
  episode_5: readImageBase64(raw.episode_5, scale_ratio),
  episode_6: readImageBase64(raw.episode_6, scale_ratio),
  episode_7: readImageBase64(raw.episode_7, scale_ratio),
  episode_8: readImageBase64(raw.episode_8, scale_ratio),
  // 物资筹备
  tactical_drill: readImageBase64(raw.tactical_drill, scale_ratio),
  aerial_threat: readImageBase64(raw.aerial_threat, scale_ratio),
  tough_siege: readImageBase64(raw.tough_siege, scale_ratio),
  cargo_escort: readImageBase64(raw.cargo_escort, scale_ratio),
  // 芯片搜索
  solid_defense: readImageBase64(raw.solid_defense, scale_ratio),
  fierce_attack: readImageBase64(raw.fierce_attack, scale_ratio),
  unstoppable_charge: readImageBase64(raw.unstoppable_charge, scale_ratio),
  fearless_protection: readImageBase64(raw.fearless_protection, scale_ratio),
  // 剿灭模式
  lungmen: readImageBase64(raw.lungmen, scale_ratio),
  lungmen_district: readImageBase64(raw.lungmen_district, scale_ratio),
  // 地图关卡
  operation_1_7: readImageBase64(raw.operation_1_7, scale_ratio),
  operation_2_5: readImageBase64(raw.operation_2_5, scale_ratio),
  operation_3_1: readImageBase64(raw.operation_3_1, scale_ratio),
  operation_3_3: readImageBase64(raw.operation_3_3, scale_ratio),
  operation_3_7_4: readImageBase64(raw.operation_3_7_4, scale_ratio),
  operation_4_3_1: readImageBase64(raw.operation_4_3_1, scale_ratio),
  operation_4_4: readImageBase64(raw.operation_4_4, scale_ratio),
  operation_5_9_3: readImageBase64(raw.operation_5_9_3, scale_ratio),
  operation_7_4: readImageBase64(raw.operation_7_4, scale_ratio),
  operation_7_10: readImageBase64(raw.operation_7_10, scale_ratio),
  operation_7_15: readImageBase64(raw.operation_7_15, scale_ratio),
  operation_7_16: readImageBase64(raw.operation_7_16, scale_ratio),
  operation_ls_5: readImageBase64(raw.operation_ls_5, scale_ratio),
  operation_ca_5: readImageBase64(raw.operation_ca_5, scale_ratio),
  operation_ap_5: readImageBase64(raw.operation_ap_5, scale_ratio),
  operation_ce_5: readImageBase64(raw.operation_ce_5, scale_ratio),
  operation_pr_a_1: readImageBase64(raw.operation_pr_a_1, scale_ratio),
  operation_pr_a_1: readImageBase64(raw.operation_pr_a_1, scale_ratio),
  operation_pr_b_1: readImageBase64(raw.operation_pr_b_1, scale_ratio),
  operation_pr_b_2: readImageBase64(raw.operation_pr_b_2, scale_ratio),
  operation_pr_c_1: readImageBase64(raw.operation_pr_c_1, scale_ratio),
  operation_pr_c_2: readImageBase64(raw.operation_pr_c_2, scale_ratio),
  operation_pr_d_1: readImageBase64(raw.operation_pr_d_1, scale_ratio),
  operation_pr_d_2: readImageBase64(raw.operation_pr_d_2, scale_ratio),
  // 开始游戏
  using_potion: readImageBase64(raw.using_potion, scale_ratio),
  using_originite: readImageBase64(raw.using_originite, scale_ratio),
  shape_confirm: readImageBase64(raw.shape_confirm, scale_ratio),
  auto_deploy: readImageBase64(raw.auto_deploy, scale_ratio),
  operation_start_1: readImageBase64(raw.operation_start_1, scale_ratio),
  operation_start_2: readImageBase64(raw.operation_start_2, scale_ratio),
  // 游戏结算
  shape_report: readImageBase64(raw.shape_report, scale_ratio),
  sanity_recovered: readImageBase64(raw.sanity_recovered, scale_ratio),
  results: readImageBase64(raw.results, scale_ratio),
};
