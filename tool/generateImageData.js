/**
 * 读取路径下的所有图片并在给定位置生成对应图片名称及其BASE64的JSON文件
 *
 * @param {*} path    图片目录
 * @param {*} format  图片格式
 * @param {*} dstPath JSON文件生成路径
 * @param {*} dstName JSON文件名
 * @returns
 */
function transImagesToJSONfile(path, format, dstPath, dstName) {
  let imgs = files.listDir(path, function (name) {
    return name.endsWith("." + format);
  });
  let results = {};

  if (imgs.length === 0) {
    console.log("路径下未找到图片: " + path);
    return;
  }

  imgs.forEach(function (img) {
    let img_name = img.replace("." + format, "");
    let img_entity = images.read(files.join(path, img));
    results[img_name] = images.toBase64(img_entity, format);
  });

  /* log(results);
  exit(); */

  try {
    files.write(files.join(dstPath, dstName), JSON.stringify(results));
  } catch(err) {
    throw err;
  }
}

// 注意此处“Autojs”是我放脚本的文件名，默认文件名为“脚本”
let path_imgs = files.join(files.getSdcardPath(), "Autojs/ArkKnights/tool/images/");
let path_imgs_main = files.join(path_imgs, "/images_main/");
let path_imgs_material = files.join(path_imgs, "/images_material/");

// 生成 IMAGES_MAIN.json
transImagesToJSONfile(path_imgs_main, "png", path_imgs, "IMAGES_MAIN.json");

// 生成 IMAGES_MATERIAL.json
transImagesToJSONfile(path_imgs_material, "png", path_imgs, "IMAGES_MATERIAL.json");