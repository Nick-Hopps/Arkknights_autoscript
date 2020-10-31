let DEFAULT_CONFIG = {
  // 配置初始化
  initialized: true,
  // 开发者模式
  developer: false,
  // 分辨率宽高比
  aspect_ratio: "",
  // 缩放比率，当前分辨率和采样分辨率之比
  scale_ratio: 1,
  // 全局找图精度
  threshold_all: 0.9,
  // 最大运行次数，超出次数直接结束
  max_running_times: 1,
  // 脚本上次运行的时间，用来判断是否当天首次运行
  last_running_time: new Date(),
  // 是否使用理智药剂补充理智
  using_potion: false,
  // 是否使用源石补充理智
  using_originite: false,
  // 补充次数
  using_times: 0,
  // 要刷取的目标材料
  target_material: "",
  // 要刷取的目标资源数量
  target_quantity: 1,
  // 每个章节最后进入的行动，用来确定左/右滑动
  last_operation: {
    episode_1: "operation_1_1",
    episode_2: "operation_2_1",
    episode_3: "operation_3_1",
    episode_4: "operation_4_1",
    episode_5: "operation_5_1",
    episode_6: "operation_6_1",
    episode_7: "operation_7_1",
  },
};

// 创建本地存储并初始化
let config = storages.create("arkknights_configs");
if (!config.get("initialized")) {
  Object.keys(DEFAULT_CONFIG).forEach(function (key) {
    config.put(key, DEFAULT_CONFIG[key]);
  });
}

// 无UI界面，暂时手动配置
config.put("developer", false);
config.put("threshold_all", 0.9);
config.put("max_running_times", 99);
config.put("using_potion", true);
config.put("using_originite", false);
config.put("using_times", 1);
config.put("target_material", "固源岩");
config.put("target_quantity", 10);

// 全局变量
let h = device.height;
let w = device.width;

// 计算宽高比
let gcd = (a, b) => (a % b === 0 ? b : gcd(b, a % b));
let ratio_h = parseInt(h / gcd(h, w));
let ratio_w = parseInt(w / gcd(h, w));
let aspect_ratio = ratio_h + ":" + ratio_w;

// 计算缩放比（对于所有 ****x1080 分辨率的设备，缩放比为 1）
let sampling_rslt = [1920, 1080]; // 根据取样设备修改
let scale_ratio = w / sampling_rslt[1];

config.put("aspect_ratio", aspect_ratio);
config.put("scale_ratio", scale_ratio);

console.log("配置已加载");