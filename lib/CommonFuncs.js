let atmt = require("./Automator");
let config = storages.create("arkknights_configs");

module.exports = {
  scaleArray: scaleArray,
  scaleObject: scaleObject,
  readImage: readImage,
  readImageBase64: readImageBase64,
  findOnly: findOnly,
  findAndClick: findAndClick,
  loopUntilFind: loopUntilFind,
  loopUntilLost: loopUntilLost,
  clickUntilFind: clickUntilFind,
  clickUntilLost: clickUntilLost,
  swipeUntilFind: swipeUntilFind,
  swipeUntilLost: swipeUntilLost,
  baiduOCR: baiduOCR,
};

/**
 * 查看对象的类名
 *
 * @param   {Object} obj 需要查询的对象
 * @returns {String} 返回对象类名
 */
function _classof(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 获取二值化后的图像
 *
 * @param {Binary} img 需要二值化的图像
 * @returns {Binary} 返回处理后的图像
 */
function _getBinary(img) {
  return images.threshold(images.grayscale(img), 128, 255);
}

/**
 * 在当前屏幕上找图的模板
 *
 * @param   {Binary}  target  寻找的目标图片
 * @param   {Boolean} binary  是否二值化
 * @param   {Object}  options 其他参数
 * @param   {Array}   options.extras    额外目标
 * @param   {Array}   options.region    找图区域
 * @param   {Float}   options.threshold 找图精确度
 * @returns {Function} 返回找图函数
 */
function _findImage(target, binary, options) {
  let opts = options || {};
  let extras;

  if (opts.extras) {
    extras = opts.extras;
    delete opts.extras;
  }

  if (!opts.threshold) {
    opts.threshold = config.get("threshold_all");
  }

  return function () {
    let img, templ, result;
    img = binary ? _getBinary(captureScreen()) : captureScreen();
    templ = binary ? _getBinary(target) : target;
    result = images.findImage(img, templ, opts);
    if (extras && _classof(extras) === "Array") {
      let pools = threads.pool({
        corePoolSize: 2,
        maxPoolSize: extras.length < 2 ? 2 : extras.length
      });
      let results = [];
      extras.forEach((target, index) => {
        pools.execute(function () {
          let templ = binary ? _getBinary(target) : target;
          results[index] = images.findImage(img, templ, opts);
        });
      });
      while (pools.getActiveCount() != 0) {}
      result = { main: result, extras: results };
      pools.shutdown();
    }
    return result;
  };
}

/**
 * 按宽高比缩放数组数值
 *
 * @param {Array} arr   原数组
 * @param {Float} ratio 缩放比例
 * @returns 放缩后的数组
 */
function scaleArray(arr, ratio) {
  return arr.map((x) => typeof x === "number" ? x * ratio : x);
}


/**
 * 按宽高比缩放对象数值
 *
 * @param {Array} obj   原对象
 * @param {Float} ratio 缩放比例
 * @returns 放缩后的对象
 */
function scaleObject(obj, ratio) {
  for (let el in obj) {
    if (typeof obj[el] === "number") {
      obj[el] *= ratio;
    }
  }
  return obj;
}

/**
 * 通过路径读取图片并按当前设备缩放比例等比例缩放
 *
 * @param   {String}  path   图片路径
 * @param   {Float}   ratio  缩放比例
 * @returns {Binary} 返回处理后的图片
 */
function readImage(path, ratio) {
  return images.scale(images.read(path), ratio, ratio);
}

/**
 * 通过BASE64读取图片并按当前设备缩放比例等比例缩放
 *
 * @param   {String}  source 图片BASE64数据
 * @param   {Float}   ratio  缩放比例
 * @returns {Binary} 返回处理后的图片
 */
function readImageBase64(source, ratio) {
  return images.scale(images.fromBase64(source), ratio, ratio);
}

/**
 * 寻找目标并返回寻找结果
 *
 * @param   {Binary}  target  寻找的目标图片
 * @param   {Boolean} binary  是否二值化
 * @param   {Object}  configs 所需的额外参数
 * @param   {Object}  configs.options 找图的其他参数
 * @param   {Int}     configs.wait    找图前的延时
 * @returns {Boolean} 返回是否找到目标
 */
function findOnly(target, binary, configs) {
  let { options, wait } = configs || {};
  options = options || {};
  wait = wait || 200;

  let find = _findImage(target, binary, options);

  sleep(wait);
  if (find()) {
    return true;
  } else {
    return false;
  }
}

/**
 * 寻找目标并点击目标位置
 *
 * @param   {Binary}  target  寻找的目标图片
 * @param   {Boolean} binary  是否二值化
 * @param   {Object}  configs 所需的额外参数
 * @param   {Object}  configs.coord   指定点击的坐标{x, y}
 * @param   {Object}  configs.offset  指定点击的坐标的偏移量
 * @param   {Object}  configs.options 找图的其他参数
 * @param   {Int}     configs.wait    找图前的延时
 * @returns {Boolean} 返回是否点击成功
 */
function findAndClick(target, binary, configs) {
  let { coord, offset, options, wait } = configs || {};
  offset = offset || {};
  options = options || {};
  wait = wait || 200;

  let find, pos, off_x, off_y;
  find = _findImage(target, binary, options);
  off_x = offset.x || 0;
  off_y = offset.y || 0;

  sleep(wait);
  if ((pos = find())) {
    if (coord) {
      atmt.click(coord.x, coord.y);
      sleep(100);
    } else {
      atmt.click(pos.x + off_x, pos.y + off_y);
      sleep(100);
    }
  } else {
    return false;
  }
  return true;
}

/**
 * 等待直到找到目标
 *
 * @param   {Binary}   target  寻找的目标图片
 * @param   {Boolean}  binary  是否二值化
 * @param   {Object}   configs 所需的额外参数
 * @param   {Object}   configs.options  找图的其他参数
 * @param   {Function} configs.process  对目标进行的操作
 * @param   {Int}      configs.bound    最大执行时长，单位 ms
 * @param   {Int}      configs.interval 等待间隔时长，单位 ms
 * @returns {Boolean} 返回是否找到目标
 */
function loopUntilFind(target, binary, configs) {
  let { options, process, bound, interval } = configs || {};
  options = options || {};
  process = process || function () {};
  bound = bound || 30e3;
  interval = interval || 300;

  let start_timestamp, extras, find, result;
  start_timestamp = new Date();
  extras = !!options.extras;
  find = _findImage(target, binary, options);
  result = find();

  while (!(extras ? result.main : result)) {
    if (+new Date() - start_timestamp <= bound) {
      process(result);
      sleep(interval);
      result = find();
    } else {
      return false;
    }
  }
  return true;
}

/**
 * 等待直到失去目标
 *
 * @param   {Binary}   target  寻找的目标图片
 * @param   {Boolean}  binary  是否二值化
 * @param   {Object}   configs 所需的额外参数
 * @param   {Object}   configs.options  找图的其他参数
 * @param   {Function} configs.process  对目标进行的操作
 * @param   {Int}      configs.bound    最大执行时长，单位 ms
 * @param   {Int}      configs.interval 等待间隔时长，单位 ms
 * @returns {Boolean} 返回是否失去目标
 */
function loopUntilLost(target, binary, configs) {
  let { options, process, bound, interval } = configs || {};
  options = options || {};
  process = process || function () {};
  bound = bound || 30e3;
  interval = interval || 300;

  let start_timestamp, extras, find, result;
  start_timestamp = new Date();
  extras = !!options.extras;
  find = _findImage(target, binary, options);
  result = find();

  while (extras ? result.main : result) {
    if (+new Date() - start_timestamp <= bound) {
      process(result);
      sleep(interval);
      result = find();
    } else {
      return false;
    }
  }
  return true;
}

/**
 * 不断点击某个位置直到找到目标
 *
 * @param   {Binary}  target  寻找的目标图片
 * @param   {Boolean} binary  是否二值化
 * @param   {Object}  configs 所需的额外参数
 * @param   {Object}  configs.coord    指定点击的坐标{x, y}
 * @param   {Object}  configs.offset   指定点击的坐标的偏移量
 * @param   {Object}  configs.options  找图的其他参数
 * @param   {Int}     configs.bound    最大执行时长，单位 ms
 * @param   {Int}     configs.interval 点击间隔时长，单位 ms
 * @returns {Boolean} 返回是否找到目标
 */
function clickUntilFind(target, binary, configs) {
  let { coord, offset, options, bound, interval } = configs || {};
  offset = offset || {};

  let off_x, off_y;
  off_x = offset.x || 0;
  off_y = offset.y || 0;

  return loopUntilFind(target, binary, {
    options: options,
    process: function (result) {
      if (coord) {
        atmt.click(coord.x, coord.y);
        sleep(100);
      } else {
        atmt.click(result.x + off_x, result.y + off_y);
        sleep(100);
      }
    },
    bound: bound,
    interval: interval,
  });
}

/**
 * 不断点击某个位置直到失去目标
 *
 * @param   {Binary}  target  寻找的目标图片
 * @param   {Boolean} binary  是否二值化
 * @param   {Object}  configs 所需的额外参数
 * @param   {Object}  configs.coord    指定点击的坐标{x, y}
 * @param   {Object}  configs.offset   指定点击的坐标的偏移量
 * @param   {Object}  configs.options  找图的其他参数
 * @param   {Int}     configs.bound    最大执行时长，单位 ms
 * @param   {Int}     configs.interval 点击间隔时长，单位 ms
 * @returns {Boolean} 返回是否失去目标
 */
function clickUntilLost(target, binary, configs) {
  let { coord, offset, options, bound, interval } = configs || {};
  offset = offset || {};

  let off_x, off_y;
  off_x = offset.x || 0;
  off_y = offset.y || 0;

  return loopUntilLost(target, binary, {
    options: options,
    process: function (result) {
      if (coord) {
        atmt.click(coord.x, coord.y);
        sleep(100);
      } else {
        atmt.click(result.x + off_x, result.y + off_y);
        sleep(100);
      }
    },
    bound: bound,
    interval: interval,
  });
}

/**
 * 不断滑动直到找到目标
 *
 * @param   {Binary}  target 寻找的目标图片
 * @param   {Boolean} binary 是否二值化
 * @param   {Object}  coords 指定滑动的坐标{x1, y1, x2, y2}
 * @param   {Object}  configs 所需的额外参数
 * @param   {Int}     configs.duration 指定滑动的持续时间，单位 ms
 * @param   {Object}  configs.options  找图的其他参数
 * @param   {Int}     configs.bound    最大执行时长，单位 ms
 * @param   {Int}     configs.interval 滑动间隔时长，单位 ms
 * @returns {Boolean} 返回是否找到目标
 */
function swipeUntilFind(target, binary, coords, configs) {
  if (!coords) throw new Error("Coordinates not valid");

  let { duration, options, bound, interval } = configs || {};
  duration = duration || 600;

  return loopUntilFind(target, binary, {
    options: options,
    process: function (result) {
      atmt.swipe(coords.x1, coords.y1, coords.x2, coords.y2, duration);
      sleep(100);
    },
    bound: bound,
    interval: interval,
  });
}

/**
 * 不断滑动直到失去目标
 *
 * @param   {Binary}  target 寻找的目标图片
 * @param   {Boolean} binary 是否二值化
 * @param   {Object}  coords 指定滑动的坐标{x1, y1, x2, y2}
 * @param   {Object}  configs 所需的额外参数
 * @param   {Int}     configs.duration 指定滑动的持续时间，单位 ms
 * @param   {Object}  configs.options  找图的其他参数
 * @param   {Int}     configs.bound    最大执行时长，单位 ms
 * @param   {Int}     configs.interval 滑动间隔时长，单位 ms
 * @returns {Boolean} 返回是否失去目标
 */
function swipeUntilLost(target, binary, coords, configs) {
  if (!coords) throw new Error("Coordinates not valid");

  let { duration, options, bound, interval } = configs || {};
  duration = duration || 600;

  return loopUntilLost(target, binary, {
    options: options,
    process: function (result) {
      atmt.swipe(coords.x1, coords.y1, coords.x2, coords.y2, duration);
      sleep(100);
    },
    bound: bound,
    interval: interval,
  });
}

/**
 * 百度OCR文字识别
 *
 * @param {*} img 需要识别的图片
 * @returns {String} 返回识别结果
 */
function baiduOCR(img) {
  let _getRes = (url, data) => data ? http.post(url, data).body.json() : http.get(url).body.json();
  let url, token, res;

  try {
    url = "https://aip.baidubce.com"
      + "/oauth/2.0/token?grant_type=client_credentials"
      + "&client_id=qgGCQuP2NGfnQDTpvTWk9tg6"
      + "&client_secret=oB8GwlHZQWFg59DaMZiF1lGsDrrh1pQx";

    if (!(token = _getRes(url)["access_token"])) {
      console.log("未获取有效token");
      return;
    }

    url = "https://aip.baidubce.com" 
      + "/rest/2.0/ocr/v1/accurate_basic" 
      + "?access_token=" + token;

    res = _getRes(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      image: images.toBase64(img),
    });

    if (res["words_result_num"] > 0) {
      return res["words_result"][0].words;
    } else {
      return "0";
    }
  } catch (err) {
    throw err;
  }
}
