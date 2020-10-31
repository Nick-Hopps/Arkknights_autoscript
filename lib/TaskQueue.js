let TaskQueue = function () {};

TaskQueue.create = function () {};
TaskQueue.push = function () {};
TaskQueue.pop = function () {};
TaskQueue.delete = function () {};
TaskQueue.swap = function () {};
TaskQueue.empty = function () {};
TaskQueue.clear = function () {};
TaskQueue.size = function () {};

// 功能设想：
// 1. 添加任务：给定数组创建任务或者每次push一个任务；
// 2. 默认行为：每次取第一个任务，每完成一次数量-1，若任务未完成则重新push回队列；
// 3. 移除任务：给定任务编号删除给定任务；
// 4. 调整任务：给定两个任务编号调整任务的先后顺序。