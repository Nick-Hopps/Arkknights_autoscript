# 😃 明日方舟自动化脚本

众所周知明日方舟是个休闲游戏，然而每天反复看录像（代理指挥）也很烦人，因此就用蚂蚁森林脚本的一些组件又写了这个脚本。这个脚本中提供的开发模板和函数功能可以很方便的应用到各种需要找图的脚本。

# 📕 脚本使用方法

首先安装 **Autojs**，我开发时使用的是版本是收费的 **Autojs Pro 8**，免费版的 **Autojs 4.1.1 Alpha 2** 经过测试同样可以运行，因此使用免费版即可。下载好后把整个项目丢到 "/sdcard/脚本/" 路径下面，然后打开软件，运行项目或者 "launch.js" 即可。

由于目前还没有提供配置的UI界面，因此需要手动去 "config_main.js" 里面修改相应的配置，每个配置项的解释可在文件内查看。

```js
config.put("developer", false);
config.put("threshold_all", 0.9);
config.put("max_running_times", 99);
config.put("using_potion", true);
config.put("using_originite", false);
config.put("using_times", 1);
config.put("target_material", "固源岩");
config.put("target_quantity", 10);
```

## ⭕ 找图相关

当前已测试并完美支持 16:9(1920x1080) 和 20:9(2400x1080) 的设备。

对于其他的全面屏设备，大部分的像素密度ppi其实都是一样的，只是屏幕高度不同罢了，因此脚本默认使用的图片和游戏截图的分辨率是一致的，一般不需要更换。但是坐标和区域相关的数值，不同分辨率的设备无法通过按比例缩放直接得到，需要自己获取后添加到 "SCALES_MAIN.js" 文件里面，至于哪些数据需要单独获取，可见该文件中的注释部分。

一般来说，如果出现识图失败的问题，请修改找图精度（`threshold_all`）配置项，从大往小调整，直到识别成功为止。如果反复修改找图精确度之后还是识图失败，或者需要添加新的识别功能，就需要自己替换/添加图片。方法按步骤：

1. 在脚本目录 "tool/images" 下面的两个子目录中可以看到脚本识别需要用到的图片。其中 "images_main" 中的图片即游戏中对应部分的截图，如果需要添加新的识别功能就直接把对应的截图保存到这个目录下；如果是替换图片则要注意和原文件名要一致。"images_material" 中的图片是脚本自动截取并保存的，在配置中设置 `developer` 为 `true` 即可触发该机制（详情见 "launch.js" 中的 `runCount()` 函数）；
2. 运行 "tool/generateImageData.js" 之后即可在 "tool/images" 目录下得到对应的 JSON 文件。用获得的 JSON 文件替换掉 "asset" 目录下的 JSON 文件，然后在 "IMAGES_MAIN.js" 或者 "IMAGES_MATERIAL.js" 中按格式修改或者添加图片；
3. 如果只是替换部分图片，则需要手动计算并单独修改这部分图片的 `scale_ratio` 值；如果是替换了全部图片，则直接去 "config_main.js" 中修改 `sampling_rslt` 为图片采样设备的分辨率，代码会根据该分辨率自动计算 `scale_ratio` 值。

- 注1：之所以要把图片保存为 BASE64，是为了避免图片在手机图库中被看到，有可能被误删，同时也满足了强迫症用户的精神洁癖。因此生成 JSON 文件后，就可以把那两个目录下的图片删掉了；  
- 注2：手机自带截图功能截取后图片是有损压缩的，尽管用来识别问题不大，但是如果希望识别结果更加准确，建议使用 Autojs 自带的截图函数截图后保存到本地；
- 注3：活动相关的图片请保存到 "IMAGES_EVENT.json"，因为活动相关的内容会经常改动。 

> 默认取样设备：HUAWEI P10PLUS 
> - 分辨率：1920*1080 
> - 屏幕尺寸：5.5 inches
> - ppi：400

## ⭕ 添加新的材料

脚本把所有的关卡都抽象成三个部分：

- **top**：顶级区域，比如主线，物资筹备，活动这些；
- **episode**：章节，主线的话就是各个章节，物资筹备的话就是战术演习、货物运送这些；
- **operation**：具体的行动，类似7-15、CE-5这些。

熟悉上面说到的概念之后就可以自己添加自己想要刷的材料了（活动关卡的添加方法一致），具体方法步骤：

1. 首先获取目标材料对应的 "episode" 和 "operation" 部分的截图（top 就那几个基本不会变）；
2. 在 "OBJECTS_MATERIAL.js" 中按如下格式添加，以作战记录为例：
```js
作战记录: { 
  top: "supplies",             // 顶级区域
  episode: "tactical_drill",   // 章节
  operation: "operation_ls_5", // 行动
  update: false,               // 是否更新区域
  category: "others",          // 材料类别
  count: false,                // 是否统计材料数量
  plural: false                // 需要统计的单个材料数量是否多于一个
},
```

- 注1：目前只有主线关卡需要设置 `update: true`，以便下次运行时可以正确判断是往左还是往右滑动来寻找关卡；  
- 注2：如果需要统计材料获取，即 `count: true`，则需要提供材料截图并添加到 "IMAGES_MATERIAL.js"，这一点上面添加图片部分有说；  
- 注3：对于 "S4-1" 这种关卡，为了方便比较关卡大小，需要保存为 "4_3_1"，代表“4-3”分支下的第一个关卡；
- 注4：当设置 `plural: true` 时，会通过 OCR 的方式识别材料右下角的数字，如果都是一个的就不需要设置。

# 🧐 脚本目录结构

```
 ├── /asset
 │   ├── IMAGES_EVENT.json        // 活动所需要的识图图片数据
 │   ├── IMAGES_MAIN.js           // 脚本主要功能的识图图片
 │   ├── IMAGES_MAIN.json         // 脚本主要功能的识图图片数据
 │   ├── IMAGES_MATERIAL.js       // 结算材料统计图片
 │   ├── IMAGES_MATERIAL.json     // 结算材料统计图片数据
 │   ├── OBJECTS_MATERIAL.js      // 材料对应关卡相关信息
 │   └── SCALES_MAIN.js           // 脚本中需要按宽高比缩放的数据
 ├── /lib
 │   ├── Automator.js             // 自动化工厂方法
 │   ├── CommonFuncs.js           // 公用函数
 │   ├── Inspector.js             // 服务检测
 │   ├── TaskQueue.js             // 任务队列
 │   └── Unlock.js                // 解锁模块（来自SuperMonster003）
 ├── /tool
 │   ├── generateImageData.js     // 将 images_main 和 images_material 中的图片转为 BASE64 后保存为 JSON 文件
 │   └── /images
 │       ├── images_main          // 对应 IMAGES_MAIN 中的图片
 │       └── images_material      // 对应 IMAGES_MATERIAL 中的图片
 ├── config_main.js               // 主要预设文件
 ├── config_unlock.js             // 解锁预设文件（来自SuperMonster003）
 ├── launch.js                    // 入口程序
 └── project.json                 // 项目信息
```

# ⚡ 功能简介

* 通过ADB自动开启无障碍服务
* 可以定时启动自动解锁并运行脚本（目前不支持安卓10及以上）
* 根据预设的目标材料对应行动自动进入关卡
* 根据预设的目标材料和目标数量自动循环运行
* 根据预设使用药水或者源石补充理智
* 识别并统计关卡结算的奖励材料：
  * 利用 `BaiduOCR` 识别数字，用来统计龙门币的数量
  * 利用 `HoughCircles` 检测结算界面的材料，用来统计材料获取

# 😶 待完成的功能（优先度降序）

* 将要刷取的材料组合成任务队列，顺序执行
* 运行主程序弹出一个对话框，询问是否变更预设，5s后直接运行
* 提供一个修改预设的 UI 界面
* 安卓10及以上的自动解锁功能
* 提供一个工具，可以添加新的关卡信息
* 完善不同分辨率的设备

# 😥 待解决的问题

* ~~解决随着识别的材料增多识别效率降低的问题：需要材料分类~~ [已解决]