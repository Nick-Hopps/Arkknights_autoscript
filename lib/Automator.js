let ra_instance = undefined;

function AutomationWithRoot() {
  if (
    !(files.exists("/sbin/su") || files.exists("/system/xbin/su") || files.exists("/system/bin/su"))
  ) {
    throw new Error("未获取ROOT权限");
  }
}

AutomationWithRoot.prototype = {
  click: (x, y) => shell("input tap " + x + " " + y, true).code === 0,
  swipe: (x1, y1, x2, y2, duration) =>
    shell("input swipe" + x1 + " " + y1 + " " + x2 + " " + y2 + " " + duration, true).code === 0,
  longPress: (x, y) =>
    shell("input swipe " + x + " " + y + " " + x + " " + y + " " + duration, true).code === 0,
  gesture: function (argus) {
    if (ra_instance === undefined) ra_instance = new RootAutomator();
    let ra = ra_instance;
    let duration = argus.shift();
    let steps = argus.length - 1;
    ra.touchDown(argus[0][0], argus[0][1]);
    argus.forEach((pos) => {
      ra.touchMove(pos[0], pos[1]);
      sleep(duration / steps);
    });
    ra.touchUp();
  },
};

function AutomationWithoutRoot() {
  if (!auto.service) {
    throw new Error("未打开无障碍服务");
  }
}

AutomationWithoutRoot.prototype = {
  click: (x, y) => click(x, y),
  swipe: (x1, y1, x2, y2, duration) => swipe(x1, y1, x2, y2, duration),
  longPress: (x, y) => press(x, y, duration),
  gesture: (argus) => gesture.apply(null, argus),
};

function Automator() {
  const _automator = device.sdkInt < 24 ? new AutomationWithRoot() : new AutomationWithoutRoot();
  return {
    click: function (x, y) {
      return _automator.click(x, y);
    },
    swipe: function (x1, y1, x2, y2, duration) {
      duration = duration || 600;
      return _automator.swipe(x1, y1, x2, y2, duration);
    },
    longPress: function (x, y) {
      return _automator.longPress(x, y);
    },
    gesture: function () {
      return _automator.gesture(Array.prototype.slice.call(arguments));
    },
  };
}

module.exports = new Automator();
