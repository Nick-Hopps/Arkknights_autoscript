function waitForAction(func, timeout, interval) {
  if (typeof timeout !== "number" || timeout < 100) timeout = 10e3;
  if (typeof interval !== "number") interval = 200;

  let _start_timestamp = +new Date();

  if (interval <= timeout) {
    while (typeof func === "function" && !func()) {
      if (+new Date() - _start_timestamp > timeout) return false;
      sleep(interval);
    }
  } else {
    return false;
  }

  return true;
}

function autoHint() {
  let _pkg = context.packageName;
  let _perm = "android.permission.WRITE_SECURE_SETTINGS";
  let _shell_sc = "adb shell pm grant " + _pkg + " " + _perm;

  console.log("自动开启无障碍服务失败");
  console.log("可能是Auto.js缺少以下权限:");
  console.log("WRITE_SECURE_SETTINGS");
  console.log("可尝试使用ADB工具连接手机");
  console.log("并执行以下Shell指令(无换行):\n" + "\n" + _shell_sc + "\n");
  console.log("Shell指令已复制到剪切板");
  console.log("重启设备后授权不会失效");

  setClip(_shell_sc);
}

function randomString(len) {
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let tempLen = chars.length,
    tempStr = "";
  for (let i = 0; i < len; ++i) {
    tempStr += chars.charAt(Math.floor(Math.random() * tempLen));
  }
  return tempStr;
}

let ispt_instance = undefined;
// 自动开启无障碍服务辅助工具
let a11y = (() => {
  let { Secure } = android.provider.Settings;
  let { putInt, getString, putString } = Secure;
  let _A11Y_SRVS_ENABLED = Secure.ENABLED_ACCESSIBILITY_SERVICES;
  let _A11Y_ENABLED = Secure.ACCESSIBILITY_ENABLED;
  let _ctx_reso = context.getContentResolver();
  let _aj_package = context.packageName;
  let _aj_service = _aj_package 
        + "/com.stardust.autojs" 
        + ".core.accessibility.AccessibilityService";

  return {
    _parseArgs(args) {
      let _srvs = [_aj_service];
      let _force = false;

      if (typeof args[0] !== "undefined") {
        if (typeof args[0] === "object") {
          _srvs = args[0];
          _force = !!args[1];
        } else if (typeof args[0] === "string") {
          _srvs = [args[0]];
          _force = !!args[1];
        } else if (typeof args[0] === "boolean") {
          _force = args[0];
        }
      }
      return {
        force: _force,
        srvs: _srvs,
      };
    },
    _getString() {
      return getString(_ctx_reso, _A11Y_SRVS_ENABLED) || "";
    },
    enable() {
      try {
        let _this = this;
        let { force, srvs } = this._parseArgs(arguments);
        let _srvs;
        if (!this.state(srvs)) {
          _srvs = this.enabled_srvs
            .split(":")
            .filter((x) => !~srvs.indexOf(x))
            .concat(srvs)
            .join(":");
        } else if (force) {
          _srvs = this.enabled_srvs;
        }
        if (_srvs) {
          putString(_ctx_reso, _A11Y_SRVS_ENABLED, _srvs);
          putInt(_ctx_reso, _A11Y_ENABLED, 1);
          if (!waitForAction(() => _this.state(srvs), 2e3)) {
            throw Error("Result Exception");
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    disable() {
      try {
        let _args0 = arguments[0];
        let $_str = (x) => typeof x === "string";
        if ($_str(_args0) && _args0.toLowerCase() === "all") {
          putString(_ctx_reso, _A11Y_SRVS_ENABLED, "");
          putInt(_ctx_reso, _A11Y_ENABLED, 1);
          return true;
        }
        let { force, srvs } = this._parseArgs(arguments);
        let _enabled_srvs = this._getString();
        let _contains = function () {
          for (let i = 0, l = srvs.length; i < l; i += 1) {
            if (~_enabled_srvs.indexOf(srvs[i])) {
              return true;
            }
          }
        };
        let _srvs;
        if (_contains()) {
          _srvs = _enabled_srvs
            .split(":")
            .filter((x) => {
              return !~srvs.indexOf(x);
            })
            .join(":");
        } else if (force) {
          _srvs = _enabled_srvs;
        }
        if (_srvs) {
          putString(_ctx_reso, _A11Y_SRVS_ENABLED, _srvs);
          putInt(_ctx_reso, _A11Y_ENABLED, 1);
          _enabled_srvs = this._getString();
          if (!waitForAction(() => !_contains(), 2e3)) {
            throw Error("Result Exception");
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    state(x) {
      let _enabled_srvs = (this.enabled_srvs = this._getString());
      if (typeof x === "undefined") {
        x = [_aj_service];
      } else if (typeof x === "string") {
        x = [x];
      }
      for (let i = 0, l = x.length; i < l; i += 1) {
        if (!~_enabled_srvs.indexOf(x[i])) {
          return false;
        }
      }
      return true;
    },
  };
})();

function Inspector() {
  this.id = randomString(8); // 测试单例模式

  this.checkA11yService = function (force) {
    if (a11y.state()) return true;

    if (force === true) {
      if (a11y.enable(true)) {
        console.log("已自动开启无障碍服务");
        return true;
      } else {
        toast("自动开启无障碍服务失败");
        autoHint();
        exit();
      }
    }

    if (typeof auto.waitFor === "function") {
      let _thd = threads.start(function () {
        auto.waitFor();
      });

      _thd.join(1e3);

      if (_thd.isAlive()) {
        alert(
          "\n" +
            "自动跳转到无障碍服务设置页面之后\n\n" +
            "请手动开启Auto.js无障碍服务开关\n\n" +
            "开启后脚本将自动继续"
        );
      }

      _thd.join(10e4);

      if (_thd.isAlive()) {
        console.log("等待用户开启无障碍服务超时");
        exit();
      }
    } else {
      try {
        auto();
      } catch (e) {
        alert(
          "\n" +
            "即将自动跳转到无障碍服务设置页面\n\n" +
            "跳转页面后请手动开启Auto.js无障碍服务开关\n\n" +
            "开启后需手动再次运行项目"
        );
      }
      exit();
    }
  };

  this.checkScreenCapture = function (landscape) {
    // 处理安卓10以上权限获取弹窗
    threads.start(function () {
      setTimeout(() => {
        if (text("立即开始").findOne(3e3)) {
          text("立即开始").findOne().click();
        }
      }, 1000);
    });

    if (!(landscape ? requestScreenCapture(landscape) : requestScreenCapture())) {
      toastLog("请求截图失败") && exit();
    }
  };
}

ispt_instance = ispt_instance ? ispt_instance : new Inspector();

module.exports = ispt_instance;
