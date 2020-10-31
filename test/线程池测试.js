var arr = {
  "arr_1": [1, 2, 3, 4, 5],
  "arr_2": [6, 7, 8, 9, 10],
  "arr_3": [11, 12, 13, 14, 15],
  "arr_4": [16, 17, 18, 19, 20],
  "arr_5": [21, 22, 23, 24, 25],
};

var search_async = function (target, arr) {
  let pools = threads.pool({
    corePoolSize: 2,
    maxPoolSize: 5
  });
  let tmp = 0;

  /* log(Object.keys(pools));
  exit(); */

  for (let sub_arr in arr) {
    (function (i) {
      pools.execute(function () {
        //log("任务：%s，线程：%s", i, threads.currentThread());
        for (let el of arr[i]) {
          if (el == target) {
            tmp = el;
            pools.shutdownNow();
          }
        }
      });
    }(sub_arr));
  }

  while (tmp == 0 && pools.getActiveCount() != 0) {
    log("线程池还有 " + pools.getActiveCount() + " 个线程正在运行");
  }

  if (tmp != 0) {
    log("线程池是否已经关闭：" + pools.isShutdown());
    return tmp;
  } else {
    pools.shutdownNow();
    log("线程池是否已经关闭：" + pools.isShutdown());
    return false;
  }
}

log(search_async(10, arr));